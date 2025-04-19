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
  brand: Joi.string().min(3).max(50).trim().required().lowercase(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(1),
  colors: Joi.array().items(
    Joi.object({
      color: Joi.string().trim().required(),
      colorHex: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#97bfc700'),
      image: Joi.string()
        .pattern(/^[\w\s.-]+\.(png|jpg|jpeg|avif)$/i)
        .default(''),
      imageDetail: Joi.array().items(
        Joi.string()
          .pattern(/^[\w\s.-]+\.(png|jpg|jpeg|avif)$/i)
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
  importAt: Joi.date().timestamp('javascript').default(Date.now),
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

    // const exist = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({
    //   name: data.name
    // })

    const exist = false

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
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).aggregate([]).toArray()

    // console.log(result)

    return result || null
  } catch (error) {
    throw new Error(error)
  }
}

const getAllProductFilter = async (filters) => {
  try {
    console.log('filters', filters)
    const matchConditions = {}

    Object.keys(filters).forEach(key => {
      const value = filters[key]

      if (value) {
        if (typeof value === 'string' && value.includes(',')) {
          matchConditions[key] = { $in: value.split(',') }
        }
        else {
          matchConditions[key] = value
        }
      }

    })

    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).aggregate([
      { $match: matchConditions }
    ]).toArray()


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

const getAllProductPage = async (page, limit, filters) => {
  try {
    const skip = (page - 1) * limit

    const matchConditions = {}

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

    // console.log('matchConditions', matchConditions)

    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).aggregate([
      { $match: matchConditions }
    ]).skip(skip).limit(limit).toArray()


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

export const productModel = {
  createNew,
  getDetails,
  findOneById,
  getAllProduct,
  getAllProductPage,
  getAllProductFilter
}