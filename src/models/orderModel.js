import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE } from '~/utils/validators'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().pattern(OBJECT_ID_RULE).message('Your string fails to match the productId pattern!').required(),
      quantity: Joi.number().min(1).default(1).required(),
      price: Joi.number().min(0).required()
    })
  ).default([]),
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

    const createdOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne(validData)
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
      {
        $match: {
          _id: new ObjectId(orderId),
          _destroy: false
        }
      }
    ]).toArray()

    return result[0] || null
  } catch (error) { throw new Error(error) }
}

const addProduct = async (orderId, product) => {
  const existProduct = await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({
    _id: new ObjectId(orderId),
    items: {
      $elemMatch: {
        productId: new ObjectId(product.productId),
        color: product.color,
        size: product.size
      }
    }
  })

  let updateOrder

  if (existProduct) {
    updateOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(orderId),
        'items.productId': new ObjectId (product.productId),
        'items.color': product.color,
        'items.size': product.size
      },
      {
        $inc: { 'items.$.quantity': 1 }
      },
      { returnDocument: 'after' }
    )
  }
  else {
    updateOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      {
        $push: {
          items: {
            productId: new ObjectId(product.productId),
            color: product.color,
            size: product.size,
            quantity: 1
          }
        }
      },
      { returnDocument: 'after' }
    )
  }

  return updateOrder
}

const removeProduct = async (orderId, product) => {
  const updateOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(orderId) },
    {
      $pull: {
        items: {
          productId: new ObjectId(product.productId),
          color: product.color,
          size: product.size
        }
      }
    },
    { returnDocument: 'after' }
  )
  return updateOrder
}

const increaseQuantity = async (orderId, { productId, color, size }) => {
  await GET_DB().collection(ORDER_COLLECTION_NAME).updateOne(
    {
      _id: new ObjectId(orderId),
      items: {
        $elemMatch: {
          productId: new ObjectId(productId),
          color: color,
          size: size
        }
      }
    },
    {
      $inc: { 'items.$.quantity': 1 }
    }
  )
  const updatedOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ _id: new ObjectId(orderId) })
  return updatedOrder
}

const decreaseQuantity = async (orderId, { productId, color, size }) => {
  await GET_DB().collection(ORDER_COLLECTION_NAME).updateOne(
    {
      _id: new ObjectId(orderId),
      items: {
        $elemMatch: {
          productId: new ObjectId(productId),
          color: color,
          size: size
        }
      }
    },
    {
      $inc: { 'items.$.quantity': -1 }
    }
  )
  const updatedOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ _id: new ObjectId(orderId) })
  return updatedOrder
}

export const orderModel = {
  createNew,
  findOneById,
  getDetails,
  addProduct,
  increaseQuantity,
  decreaseQuantity,
  removeProduct
}