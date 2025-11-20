import { GET_DB } from '~/config/mongodb'
import Joi from 'joi'
import { OBJECT_ID_RULE } from '~/utils/validators'
import { ObjectId } from 'mongodb'

const CART_COLLECTION_NAME = 'carts'
const CART_COLLECTION_SCHEMA = Joi.object({
  customerId: Joi.string().pattern(OBJECT_ID_RULE).required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().pattern(OBJECT_ID_RULE).required(),
      quantity: Joi.number().min(1).required(),
      color: Joi.string().required(),
      size: Joi.number().required()
    })
  ).required(),
  totalPrice: Joi.number().min(0).required(),
  createAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

const validateBeforeCreate = async (data) => {
  return await CART_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (cartData) => {
  await validateBeforeCreate(cartData)
  const result = await GET_DB().collection(CART_COLLECTION_NAME).insertOne(cartData)
  return result
}

const findOneById = async (cartId) => {
  return await GET_DB().collection(CART_COLLECTION_NAME).findOne({ _id: cartId })
}

const findCartByCustomerId = async (customerId) => {
  return await GET_DB().collection(CART_COLLECTION_NAME).findOne({ customerId: customerId })
}

const updateCart = async (cartId, updateData) => {
  const result = await GET_DB()
    .collection(CART_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(cartId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

  return result
}


export const cartModel = {
  findOneById,
  createNew,
  findCartByCustomerId,
  updateCart
}