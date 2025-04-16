import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict().message({
      'any.required': 'Name is required (giaduc)',
      'string.empty': 'Name is not allowed to be empty (giaduc)',
      'string.min': 'Name min 3 chars (giaduc)',
      'string.max': 'Name max 50 chars (giaduc)'
    }),
    type: Joi.string().required().valid('sneaker', 'classic', 'running', 'basketball', 'football', 'boot').min(3).max(50).trim().strict().message({ 'any.only': 'Type must be one of the allowed values' }),
    brand: Joi.string().required().min(3).max(50).trim().strict(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    image: Joi.array().items(Joi.string().pattern(/^[\w\s.-]+\.(png|jpg|jpeg)$/i).message('Each image must be valid')).max(10).default([]),
    imageDetail: Joi.array().items(Joi.string().pattern(/^[\w\s.-]+\.(png|jpg|jpeg)$/i).message('Each imageDetail must be valid')).max(6).default([]),
    color: Joi.array().items(Joi.string().trim().strict()).default([]),
    size: Joi.array().items(Joi.number().positive()).default([])
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ') || 'Validation failed'
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const productValidation = {
  createNew
}