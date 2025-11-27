import { GET_DB } from '~/config/mongodb'
import Joi from 'joi'
import { OBJECT_ID_RULE } from '~/utils/validators'
import { ObjectId } from 'mongodb'

const CART_COLLECTION_NAME = 'carts'
const CART_COLLECTION_SCHEMA = Joi.object({
  customerId: Joi.string().pattern(OBJECT_ID_RULE).required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().pattern(OBJECT_ID_RULE),
      quantity: Joi.number().min(1),
      color: Joi.string(),
      size: Joi.number()
    })
  ).default([]),
  totalPrice: Joi.number().min(0).default(0),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

const validateBeforeCreate = async (data) => {
  return await CART_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (cartData) => {
  const validData = await validateBeforeCreate(cartData)

  const existedCart = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ customerId: validData.customerId })
  if (existedCart) {
    throw new Error('Cart for this customer already exists')
  }

  const result = await GET_DB().collection(CART_COLLECTION_NAME).insertOne({
    ...validData,
    customerId: new ObjectId(validData.customerId)
  })
  return result
}

const findOneById = async (cartId) => {
  return await GET_DB().collection(CART_COLLECTION_NAME).findOne({ _id: cartId })
}

const findCartByCustomerId = async (customerId) => {
  return await GET_DB().collection(CART_COLLECTION_NAME).findOne({ customerId: new ObjectId(customerId) })
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

const addProductToCart = async (cartId, productData, price) => {
  const productExisted = await GET_DB()
    .collection(CART_COLLECTION_NAME)
    .updateOne(
      {
        _id: new ObjectId(cartId),
        'items.productId': productData.productId,
        'items.color': productData.color,
        'items.size': productData.size
      },
      {
        $inc: {
          'items.$.quantity': 1,
          totalPrice: price
        },
        $set: { updatedAt: new Date() }
      }
    )

  if (productExisted.modifiedCount === 0) {
    await GET_DB()
      .collection(CART_COLLECTION_NAME)
      .updateOne(
        {
          _id: new ObjectId(cartId)
        },
        {
          $push: {
            items: {
              ...productData,
              quantity: 1
            }
          },
          $inc: {
            totalPrice: price
          },
          $set: {
            updatedAt: new Date()
          }
        }
      )
  }
}


const removeProductFromCart = async (cartId, productId) => {
  const result = await GET_DB().collection(CART_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(cartId) },
    { $pull: { items: { productId: productId } }, $set: { updatedAt: new Date() } }
  )
  return result
}

const deleteCart = async (cartId) => {
  await GET_DB().collection(CART_COLLECTION_NAME).deleteOne({ _id: new ObjectId(cartId) })
}

export const cartModel = {
  findOneById,
  createNew,
  findCartByCustomerId,
  updateCart,
  addProductToCart,
  removeProductFromCart,
  deleteCart
}