import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const CUSTOMER_COLLECTION_NAME = 'customers'
const CUSTOMER_COLLECTION_SCHEMA = Joi.object({
  userName: Joi.string().required().min(5).max(50).trim().strict(),
  password: Joi.string().required().min(8).max(256).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  email: Joi.string().email({ tlds: { allow: false } }).trim().lowercase().messages({
    'string.email': 'Email must be a valid email address'
  }),
  role: Joi.string().valid('admin', 'client').default('client'),
  address: Joi.string().max(256).trim().strict(),
  phone: Joi.string().min(10).max(12).trim().strict(),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const validateBeforeCreate = async (data) => {
  return await CUSTOMER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) { throw new Error(error) }
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const createCustomer = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).insertOne(validData)

    return createCustomer
  } catch (error) { throw new Error(error) }
}

const getDetails = async (customerId) => {
  try {
    const result = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(customerId),
        isActive: true
      } }
    ]).toArray()
    console.log(result)
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

export const customerModel = {
  createNew,
  findOneById,
  getDetails
}
