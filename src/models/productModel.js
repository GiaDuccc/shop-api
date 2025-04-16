/* eslint-disable no-lonely-if */
import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const PRODUCT_COLLECTION_NAME = 'products'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  type: Joi.string().required().valid('sneaker', 'classic', 'running', 'basketball', 'football', 'boot').min(3).max(50).trim().strict().message({ 'any.only': 'Type must be one of the allowed values' }),
  brand: Joi.string().required().min(3).max(50).trim().strict(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
  color: Joi.array().items(Joi.string().trim().strict()).default([]),
  size: Joi.array().items(Joi.number().positive()).default([]),
  image: Joi.array().items(Joi.string().pattern(/^[\w\s.-]+\.(png|jpg|jpeg)$/i).message('Each image must be valid')).max(10).default([]),
  imageDetail: Joi.array().items(Joi.string().pattern(/^[\w\s.-]+\.(png|jpg|jpeg)$/i).message('Each imageDetail must be valid')).max(6).default([]),
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

    const exist = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({
      name: data.name
    })

    if ( exist ) {
      throw new ApiError(StatusCodes.CONFLICT, 'Tên sản phẩm đã tồn tại')
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
    // console.log(result)
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