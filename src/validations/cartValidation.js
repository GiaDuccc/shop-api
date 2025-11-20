import Joi from 'joi'
import { OBJECT_ID_RULE } from '~/utils/validators'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const schema = Joi.object({
    customerId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .required()
      .messages({
        'any.required': 'customerId is required',
        'string.empty': 'customerId cannot be empty',
        'string.pattern.base': 'customerId must be a valid ObjectId'
      }),

    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string()
            .pattern(OBJECT_ID_RULE)
            .required()
            .messages({
              'any.required': 'productId is required',
              'string.empty': 'productId cannot be empty',
              'string.pattern.base': 'productId must be a valid ObjectId'
            }),

          quantity: Joi.number()
            .min(1)
            .required()
            .messages({
              'any.required': 'quantity is required',
              'number.base': 'quantity must be a number',
              'number.min': 'quantity must be at least 1'
            }),

          color: Joi.string()
            .required()
            .messages({
              'any.required': 'color is required',
              'string.empty': 'color cannot be empty'
            }),

          size: Joi.number()
            .required()
            .messages({
              'any.required': 'size is required',
              'number.base': 'size must be a number'
            })
        })
      )
      .required()
      .messages({
        'any.required': 'items is required',
        'array.base': 'items must be an array',
        'array.includes': 'items contains an invalid product',
        'array.min': 'items cannot be an empty array'
      })
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateCart = async (req, res, next) => {
  const schema = Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string()
            .pattern(OBJECT_ID_RULE)
            .required()
            .messages({
              'any.required': 'productId is required',
              'string.empty': 'productId cannot be empty',
              'string.pattern.base': 'productId must be a valid ObjectId'
            }),

          quantity: Joi.number()
            .min(1)
            .required()
            .messages({
              'any.required': 'quantity is required',
              'number.base': 'quantity must be a number',
              'number.min': 'quantity must be at least 1'
            }),

          color: Joi.string()
            .required()
            .messages({
              'any.required': 'color is required',
              'string.empty': 'color cannot be empty'
            }),

          size: Joi.number()
            .required()
            .messages({
              'any.required': 'size is required',
              'number.base': 'size must be a number'
            })
        })
      )
      .required()
      .messages({
        'any.required': 'items is required',
        'array.base': 'items must be an array',
        'array.includes': 'items contains an invalid product',
        'array.min': 'items cannot be an empty array'
      })
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}
export const cartValidation = {
  createNew,
  updateCart
}