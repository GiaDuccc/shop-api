import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
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
      })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  } catch (error) {
    const errorMessage = new Error(error).message

    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const addOrder = async (req, res, next) => {
  const correctCondition = Joi.object({
    orderId: Joi.string().pattern(OBJECT_ID_RULE).message('Your string fails to match the productId pattern!').required(),
    status: Joi.string().valid('cart', 'pending', 'completed', 'canceled').default('cart')
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()

  } catch (error) {
    const errorMessage = new Error(error).message

    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const changeRole = async (req, res, next) => {
  const correctCondition = Joi.object({
    role: Joi.string().valid('client', 'admin')
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()

  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'role is invalid')
    next(customError)
  }

}

const updateCustomer = async (req, res, next) => {
  const correctCondition = Joi.object({
    lastName: Joi.string().max(256).trim().messages({
      'string.empty': 'lastName is not allow empty'
    }),
    firstName: Joi.string().max(256).trim().messages({
      'string.empty': 'fistName is not allow empty'
    }),
    email: Joi.string().email({ tlds: { allow: true } }).trim().lowercase().messages({
      'string.email': 'email must be a valid email address',
      'string.empty': 'email is not allow empty'
    }),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).messages({
      'string.pattern.base': 'phone number is invalid',
      'string.empty': 'phone is not allow empty'
    }),
    address: Joi.string().trim().messages({
      'string.empty': 'address is not allow empty'
    })
  })

  try {
    await correctCondition.validateAsync(req.body.properties, { abortEarly: false })
    next()

  } catch (error) {
    const errorMessage = new Error(error).message

    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const customerValidation = {
  createNew,
  addOrder,
  changeRole,
  updateCustomer
}