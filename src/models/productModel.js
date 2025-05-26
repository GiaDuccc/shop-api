/* eslint-disable no-lonely-if */
import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const PRODUCT_COLLECTION_NAME = 'products'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(50).trim().required(),
  highLight: Joi.string().max(255).trim().default(''),
  desc: Joi.string().trim().default(''),
  type: Joi.string().valid('sneaker', 'classic', 'running', 'basketball', 'football', 'boot').required(),
  brand: Joi.string().min(3).max(50).trim().lowercase().valid('nike', 'adidas', 'puma', 'new balance', 'vans').required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0),
  adImage: Joi.string().default(''),
  navbarImage: Joi.string().default(''),
  colors: Joi.array().items(
    Joi.object({
      color: Joi.string().trim().required(),
      colorHex: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#97bfc700'),
      imageDetail: Joi.array().items(
        Joi.string()
      ).max(6).default([]),
      sizes: Joi.array().items(
        Joi.object({
          size: Joi.number().positive().required(),
          quantity: Joi.number().min(0).required()
        })
      ).min(1).required()
    })
  ).min(1).required(),
  slug: Joi.string().required().min(3).trim().strict(),
  importAt: Joi.date().timestamp('javascript').default(new Date),
  exportAt: Joi.date().timestamp('javascript').default(null),
  updateAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const exist = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({
      name: data.name,
      _destroy: false
    })

    if (exist) {
      throw new ApiError(StatusCodes.CONFLICT, 'Sản phẩm đã tồn tại')
    }
    else {
      const createdProduct = await GET_DB().collection(PRODUCT_COLLECTION_NAME).insertOne(validData)
      return createdProduct
    }

  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (id) => {
  try {
    // console.log('run Model')
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          _destroy: false
        }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const getAllProduct = async () => {
  try {
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).aggregate([
      { $match: { _destroy: false } }
    ]).toArray()

    return result || null
  } catch (error) {
    throw new Error(error)
  }
}

const getAllProductPage = async (page, limit, filterOptions) => {
  try {
    const skip = (page - 1) * limit
    const { sort, ...filters } = filterOptions

    const matchConditions = { _destroy: false }

    Object.keys(filters).forEach(key => {

      const value = filters[key]

      if (key === 'stock') {
        if (typeof value === 'string' && value.includes(',')) {
          matchConditions[key] = { $gte: 0 }
        }
        else {
          if (value === 'just in') {
            matchConditions[key] = { $gte: 1 }
          }
          else {
            matchConditions[key] = { $lte: 0 }
          }
        }
      }
      else if (key === 'search') {
        matchConditions.name = { $regex: value, $options: 'i' }
      }
      else if (key === 'color') {
        if (typeof value === 'string' && value.includes(',')) {
          const realKey = `colors.${key}`
          matchConditions[realKey] = { $in: value.split(',') }
        }
        else {
          const realKey = `colors.${key}`
          matchConditions[realKey] = value
        }
      }
      else {
        if (value) {
          if (typeof value === 'string' && value.includes(',')) {
            matchConditions[key] = { $in: value.split(',') }
          }
          else {
            matchConditions[key] = value
          }
        }
      }

    })

    let sortOption = {}

    switch (sort) {
    case 'newest':
      sortOption = { importAt: -1 }
      break
    case 'oldest':
      sortOption = { importAt: 1 }
      break
    case 'low-high':
      sortOption = { price: 1 }
      break
    case 'high-low':
      sortOption = { price: -1 }
      break
    default:
      sortOption = {}
    }

    const allFilter = [
      { $match: matchConditions },
      { $skip: skip },
      { $limit: limit }
    ]

    if (Object.keys(sortOption).length > 0) {
      allFilter.push({ $sort: sortOption })
    }

    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).aggregate(allFilter).toArray()


    const total = await GET_DB().collection(PRODUCT_COLLECTION_NAME).countDocuments(matchConditions)

    const products = {
      products: result,
      total: total
    }

    return products
  } catch (error) {
    throw new Error(error)
  }
}

const deleteProduct = async (productId) => {
  await GET_DB().collection(PRODUCT_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(productId) },
    {
      $set: {
        _destroy: true
      }
    }
  )
}

const updateProduct = async (id, properties) => {
  const newProduct = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: properties
    },
    { returnDocument: 'after' }
  )
  return newProduct
}

const updateQuantitySold = async (id, quantity) => {
  const newProduct = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $inc: { quantitySold: quantity }
    },
    { returnDocument: 'after' }
  )
  return newProduct
}

const getAllProductQuantity = async () => {
  const productQuantity = await GET_DB().collection(PRODUCT_COLLECTION_NAME).countDocuments()
  return productQuantity
}

const getTopBestSeller = async () => {
  const topProduct = await GET_DB().collection(PRODUCT_COLLECTION_NAME)
    .find({ quantitySold: { $exists: true } })
    .sort({ quantitySold: -1 })
    .limit(3)
    .toArray()

  return topProduct
}

const getProductsByBrandAndType = async (brand, type) => {
  const a = await GET_DB()
    .collection(PRODUCT_COLLECTION_NAME)
    .find({ brand: brand, type: type })
    .limit(6)
    .sort({ importAt: -1 })
    .toArray()

  return a
}

const getTypeFromNavbar = async (brand) => {
  const typesAndNavbarImages = await GET_DB().collection(PRODUCT_COLLECTION_NAME).aggregate([
    { $match: { brand: brand, _destroy: false } },
    { $sort: { createdAt: -1 } }, // hoặc { _id: -1 } nếu không có createdAt
    {
      $group: {
        _id: '$type',
        latestProduct: { $last: '$$ROOT' }
      }
    },
    {
      $project: {
        _id: 0,
        type: '$_id',
        navbarImage: '$latestProduct.navbarImage'
      }
    }
  ]).toArray()

  return typesAndNavbarImages
}

export const productModel = {
  createNew,
  getDetails,
  findOneById,
  getAllProduct,
  getAllProductPage,
  deleteProduct,
  updateProduct,
  updateQuantitySold,
  getAllProductQuantity,
  getTopBestSeller,
  getProductsByBrandAndType,
  getTypeFromNavbar
}