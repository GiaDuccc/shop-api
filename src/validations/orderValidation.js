import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    customerId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'any.required': 'customerId is required',
      'string.base': 'customerId must be a string',
      'string.pattern.base': 'customerId must be a valid ObjectId'
    }),

    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
          'any.required': 'productId is required',
          'string.base': 'productId must be a string',
          'string.pattern.base': 'productId must be a valid ObjectId'
        }),
        size: Joi.number().required().messages({
          'any.required': 'size is required',
          'string.base': 'size must be a string'
        }),
        quantity: Joi.number().min(1).default(1).required(),
        color: Joi.string().required()
      })
    ).required().min(1).messages({
      'any.required': 'items is required',
      'array.base': 'items must be an array',
      'array.min': 'items must contain at least one item'
    }),

    status: Joi.string().valid('pending', 'delivering', 'completed', 'canceled').default('pending'),

    totalPrice: Joi.number().min(0).required().messages({
      'any.required': 'totalPrice is required',
      'number.base': 'totalPrice must be a number',
      'number.min': 'totalPrice must be at least 0'
    }),

    payment: Joi.string().valid('COD', 'QR', 'eWallet', 'credit').required().messages({
      'any.required': 'payment is required',
      'string.base': 'payment must be a string',
      'any.only': 'payment must be one of COD, QR, eWallet, credit'
    }),

    address: Joi.string().min(5).required().messages({
      'any.required': 'address is required',
      'string.base': 'address must be a string',
      'string.min': 'address must be at least 5 characters long'
    }),

    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
      'any.required': 'phoneNumber is required',
      'string.base': 'phoneNumber must be a string',
      'string.pattern.base': 'phoneNumber must be a valid phone number with 10 to 15 digits'
    }),

    name: Joi.string().min(2).required().messages({
      'any.required': 'Name is required',
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least 2 characters long'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error))
  }
}


const updateStatus = async (req, res, next) => {
  const correctCondition = Joi.object({
    status: Joi.string().valid('cart', 'pending', 'delivering', 'completed', 'canceled')
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'status is invalid')
    next(customError)
  }
}

export const orderValidation = {
  createNew,
  updateStatus
}