import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

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
  image: Joi.array().items(Joi.string().uri().message('Each image must be valid')).max(10).default([]),
  imageDetail: Joi.array().items(Joi.string().uri().message('Each imageDetail must be valid')).max(6).default([]),
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

    const createdProduct = await GET_DB().collection(PRODUCT_COLLECTION_NAME).insertOne(validData)

    return createdProduct
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
      { $match: {
        _id: new ObjectId(id),
        _destroy: false
      } }
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
    return result || null
  } catch (error) {
    throw new Error(error)
  }
}

const getAllProductPage = async (page, limit) => {
  try {
    const skip = (page - 1)* limit

    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).find({}).skip(skip).limit(limit).toArray()

    const total = await GET_DB().collection(PRODUCT_COLLECTION_NAME).countDocuments({})

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
  getAllProductPage
}