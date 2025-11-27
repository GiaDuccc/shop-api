import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE } from '~/utils/validators'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  customerId: Joi.string().pattern(OBJECT_ID_RULE).required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().pattern(OBJECT_ID_RULE).message('Your string fails to match the productId pattern!').required(),
      quantity: Joi.number().min(1).default(1).required(),
      size: Joi.number().required(),
      color: Joi.string().required()
    })
  ).required().min(1),
  totalPrice: Joi.number().min(0).required(),
  payment: Joi.string().valid('COD', 'QR', 'eWallet', 'credit').required(),
  address: Joi.string().min(5).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  name: Joi.string().min(2).required(),
  status: Joi.string().valid('pending', 'delivering', 'completed', 'canceled').default('pending'),
  createdAt: Joi.date().timestamp('javascript').default(new Date()),
  updatedAt: Joi.date().timestamp('javascript').default(new Date())
})

const validateBeforeCreate = async (data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const createdOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne({
      ...validData,
      customerId: new ObjectId(validData.customerId),
      items: validData.items.map(item => ({
        ...item,
        productId: new ObjectId(item.productId)
      }))
    })
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
          _id: new ObjectId(orderId)
        }
      }
    ]).toArray()

    return result[0] || null
  } catch (error) { throw new Error(error) }
}

const update = async (orderId, totalPrice, payment) => {
  await GET_DB().collection(ORDER_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        totalPrice: totalPrice,
        status: 'pending',
        createdAt: new Date(),
        payment: payment
      }
    }
  )
  const updatedOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ _id: new ObjectId(orderId) })
  return updatedOrder
}

const updateStatus = async (orderId, status) => {
  await GET_DB().collection(ORDER_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        status: status,
        updateAt: new Date()
      }
    }
  )
  return 'update status success'
}

const getAllOrdersPage = async (page, limit, filterOptions) => {
  try {
    const skip = (page - 1) * limit
    const { sort, search } = filterOptions

    let sortOption = {}

    switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 }
      break
    case 'oldest':
      sortOption = { createdAt: 1 }
      break
    case 'low-high':
      sortOption = { totalPrice: 1 }
      break
    case 'high-low':
      sortOption = { totalPrice: -1 }
      break
    default:
      sortOption = {}
    }

    const matchConditions = {
      status: { $ne: 'cart' },
      _destroy: false // not equal
    }

    if (search) {
      const orConditions = []

      orConditions.push(
        { address: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      )

      matchConditions.$or = orConditions
    }

    const allFilter = [
      { $match: matchConditions },
      ...(Object.keys(sortOption).length > 0 ? [{ $sort: sortOption }] : []),
      { $skip: skip },
      { $limit: limit }
    ]

    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).aggregate(allFilter).toArray()

    const total = await GET_DB().collection(ORDER_COLLECTION_NAME).countDocuments(matchConditions)

    const orders = {
      products: result,
      total: total
    }

    return orders
  } catch (error) { throw new Error(error) }
}

const deleteOrder = async (orderId) => {
  await GET_DB().collection(ORDER_COLLECTION_NAME).delete(
    { _id: new ObjectId(orderId) }
  )
}

const getQuantityAndProfit = async () => {
  const quantity = await GET_DB().collection(ORDER_COLLECTION_NAME).countDocuments()
  const profit = await GET_DB().collection(ORDER_COLLECTION_NAME).aggregate([
    {
      $group: {
        _id: null,
        profit: { $sum: '$totalPrice' }
      }
    }
  ]).toArray()
  const result = {
    quantity: quantity,
    profit: profit[0]?.profit || 0
  }

  return result
}

const getOrderChartByDay = async (startOfToday, endOfToday) => {
  const result = await GET_DB().collection(ORDER_COLLECTION_NAME).aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      }
    },
    {
      $group: {
        _id: { hour: { $hour: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        hour: '$_id.hour',
        count: 1
      }
    },
    {
      $sort: { hour: 1 }
    }
  ]).toArray()

  const fullHours = Array.from({ length: 24 }, (_, hour) => {
    const found = result.find(item => item.hour === hour)
    return {
      hour,
      count: found ? found.count : 0
    }
  })

  return fullHours
}

const getOrderChartByYear = async (startOfYear, endOfYear) => {

  const orders = await GET_DB().collection(ORDER_COLLECTION_NAME).aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfYear,
          $lt: endOfYear
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' }
        },
        totalOrders: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        totalOrders: 1
      }
    },
    {
      $sort: { month: 1 }
    }
  ]).toArray()

  const productQuantitySold = await GET_DB().collection(ORDER_COLLECTION_NAME).aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfYear,
          $lt: endOfYear
        }
      }
    },
    {
      $unwind: '$items' // Gỡ từng sản phẩm trong mảng items
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' }
        },
        totalQuantity: { $sum: '$items.quantity' }
      }
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        totalQuantity: 1
      }
    },
    {
      $sort: { month: 1 }
    }
  ]).toArray()

  const fullDataOrder = []
  const fullDataProductQuantity = []

  for (let i = 1; i <= 12; i++) {
    const orderMonth = orders.find(item => item.month === i)
    fullDataOrder.push({
      month: i,
      totalOrders: orderMonth?.totalOrders || 0
    })
    const productMonth = productQuantitySold.find(item => item.month === i)
    fullDataProductQuantity.push({
      month: i,
      totalQuantity: productMonth?.totalQuantity || 0
    })
  }

  const result = { fullDataOrder, fullDataProductQuantity }

  return result
}

const getCustomerOrders = async (customerId) => {
  const orders = await GET_DB().collection(ORDER_COLLECTION_NAME).find({ customerId: new ObjectId(customerId) }).toArray()
  return orders
}


export const orderModel = {
  createNew,
  findOneById,
  getDetails,
  update,
  getAllOrdersPage,
  deleteOrder,
  updateStatus,
  getQuantityAndProfit,
  getOrderChartByDay,
  getOrderChartByYear,
  getCustomerOrders
}