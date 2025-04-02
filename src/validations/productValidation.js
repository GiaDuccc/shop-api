import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { ApiError } from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict().message({
      'any.required': 'Name is required (giaduc)',
      'string.empty': 'Name is not allowed to be empty (giaduc)',
      'string.min': 'Name min 3 chars (giaduc)',
      'string.max': 'Name max 50 chars (giaduc)'
    }),
    desc: Joi.string().required().min(3).max(256).trim().strict(),
    brand: Joi.string().required().min(3).max(50).trim().strict(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    color: Joi.array().items(Joi.string().trim().strict()).default([]),
    size: Joi.array().items(Joi.number().positive()).default([])
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

export const productValidation = {
  createNew
}