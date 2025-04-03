import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE } from '~/utils/validators'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  customerId: Joi.string().pattern(OBJECT_ID_RULE).message('Your string fails to match the customerId pattern!').required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().pattern(OBJECT_ID_RULE).message('Your string fails to match the productId pattern!').required(),
      quantity: Joi.number().min(1).default(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  slug: Joi.string().required().min(3).trim().strict(),
  totalPrice: Joi.number().min(0).default(0),
  status: Joi.string().valid('cart', 'pending', 'completed', 'canceled').default('cart'),
  createdAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newOrderToAdd = {
      ...validData,
      customerId: new ObjectId(validData.customerId),
      items: validData.items.map(product => ({
        ...product,
        productId: new ObjectId(product.productId)
      }))
    }

    const createdOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne(newOrderToAdd)
    return createdOrder
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (orderId) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({
      _id: new ObjectId(orderId)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (orderId) => {
  try {
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(orderId),
        _destroy: false
      } }
    ]).toArray()

    return result[0] || null
  } catch (error) { throw new Error(error) }
}

export const orderModel = {
  createNew,
  findOneById,
  getDetails
}