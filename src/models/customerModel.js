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
      status: Joi.string().valid('cart', 'pending', 'completed', 'cancelled').default('cart')
    })
  ),
  slug: Joi.string().min(3).trim().strict(),
  role: Joi.string().valid('admin', 'client').default('client'),
  address: Joi.string().max(256).trim().default(''),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
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

    const existEmail = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOne({ email: data.email })

    const existPhone = await GET_DB().collection(CUSTOMER_COLLECTION_NAME).findOne({ phone: data.phone })

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
          isActive: true
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
    { $push: { orders: {
      orderId: new ObjectId(order.orderId),
      status: order.status
    } } },
    { returnDocument: 'after' }
  )
  return updateCustomer
}

export const customerModel = {
  createNew,
  findOneById,
  getDetails,
  login,
  addOrder
}
