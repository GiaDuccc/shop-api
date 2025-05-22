import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { OBJECT_ID_RULE } from '~/utils/validators'

const CUSTOMER_COLLECTION_NAME = 'customers'
const CUSTOMER_COLLECTION_SCHEMA = Joi.object({
  lastName: Joi.string().required().max(256).trim(),
  firstName: Joi.string().required().max(256).trim(),
  country: Joi.string().required().max(2).trim(),
  dob: Joi.date().less('now').greater('1-1-1900').messages({
    'date.base': 'Date of birth must be a valid date',
    'date.less': 'Date of birth must be in the past',
    'any.required': 'Date of birth is required'
  }),
  email: Joi.string().email({ tlds: { allow: true } }).trim().lowercase().messages({
    'string.email': 'Email must be a valid email address'
  }),
  phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
  password: Joi.string().min(8)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character',
      'any.required': 'Password is required'
    }),
  orders: Joi.array().items(
    Joi.object({
      orderId: Joi.string().pattern(OBJECT_ID_RULE).required(),
      status: Joi.string().valid('cart', 'completed', 'cancelled').default('cart')
    })
  ),
  slug: Joi.string().min(3).trim().strict(),
  role: Joi.string().valid('manager', 'admin', 'client').default('client'),
  address: Joi.string().max(256).trim().default('Unknown'),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(new Date),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
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
  // eslint-disable-next-line no-useless-catch
  try {
    const validData = await validateBeforeCreate(data)

    const existEmail = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOne({ email: data.email, _destroy: false })

    const existPhone = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOne({ phone: data.phone, _destroy: false })

    if (existEmail || existPhone) {
      const errors = {}

      if (existEmail) errors.email = 'Email already exists'
      if (existPhone) errors.phone = 'Phone number already exists'

      throw new ApiError(StatusCodes.CONFLICT, 'Duplicate data found', errors)
    }

    const createCustomer = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).insertOne(validData)

    return createCustomer
  } catch (error) { throw error }
}

const getAllCustomerPage = async (page, limit, filters) => {
  const skip = (page - 1) * limit
  const { sort, search } = filters

  let sortOption = {}

  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 }
      break
    case 'oldest':
      sortOption = { createdAt: 1 }
      break
    case 'A-Z':
      sortOption = { lastName: 1 }
      break
    case 'Z-A':
      sortOption = { lastName: -1 }
      break
    default:
      sortOption = {}
  }

  const matchConditions = {
    _destroy: false // not equal
  }

  if (search) {
    const orConditions = []

    orConditions.push(
      { address: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
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

  const allCustomer = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).aggregate(allFilter).toArray()
  const total = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).countDocuments({
    _destroy: false
  })

  const result = {
    customers: allCustomer,
    total: total
  }

  return result
}

const login = async (input) => {
  // try {
  const user = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOne({
    $or: [
      { email: input.username },
      { phone: input.username }
    ]
  })

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Email or Password.')
  }

  return user
  // } catch (error) { throw error }
}

const getDetails = async (customerId) => {
  try {
    const result = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(customerId),
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

const addOrder = async (customerId, order) => {
  const updateCustomer = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(customerId) },
    {
      $push: {
        orders: {
          orderId: new ObjectId(order.orderId),
          status: order.status
        }
      }
    },
    { returnDocument: 'after' }
  )
  return updateCustomer
}

const updateOrder = async (customerId, orderId, status) => {
  const updateOrder = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOneAndUpdate(
    {
      _id: new ObjectId(customerId),
      'orders.orderId': new ObjectId(orderId)
    },
    {
      $set: {
        'orders.$.status': status
      }
    },
    { returnDocument: 'after' }
  )
  return updateOrder
}

const deleteCustomer = async (customerId) => {
  await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(customerId) },
    {
      $set: {
        _destroy: true
      }
    }
  )

  return 'Delete successfull'
}

const changeRole = async (customerId, role) => {
  await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOneAndUpdate(
    {
      _id: new ObjectId(customerId),
      _destroy: false
    },
    {
      $set: {
        role: role
      }
    }
  )

  return 'Change role customer successfully'
}

const getAllCustomerQuantity = async () => {
  const customerQuantity = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).countDocuments()
  return customerQuantity
}

const getCustomerChartByDay = async (startOfToday, endOfToday) => {
  const result = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).aggregate([
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

const getCustomerChartByYear = async (startOfYear, endOfYear) => {

  const rawData = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).aggregate([
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
        totalCustomers: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        totalCustomers: 1
      }
    },
    {
      $sort: { month: 1 }
    }
  ]).toArray()

  const fullData = []
  for (let i = 1; i <= 12; i++) {
    const monthData = rawData.find(item => item.month === i)
    fullData.push({
      month: i,
      totalCustomers: monthData?.totalCustomers || 0
    })
  }

  return fullData
}


export const customerModel = {
  createNew,
  findOneById,
  getAllCustomerPage,
  getDetails,
  login,
  addOrder,
  updateOrder,
  deleteCustomer,
  changeRole,
  getAllCustomerQuantity,
  getCustomerChartByDay,
  getCustomerChartByYear
}
