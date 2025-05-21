import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().pattern(OBJECT_ID_RULE).message('Your string fails to match the productId pattern!').required(),
        quantity: Joi.number().min(1).default(1).required(),
        color: Joi.string().required(),
        price: Joi.number().min(0).required()
      })
    ).default([])
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

const addProduct = async (req, res, next) => {
  const correctCondition = Joi.object({
    productId: Joi.string().pattern(OBJECT_ID_RULE).message('Your string fails to match the productId pattern!').required(),
    color: Joi.string().required(),
    size: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.string().required(),
    image: Joi.string().required()
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

const addInformation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(1).max(256).required(),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
    address: Joi.string().min(1).max(256).required()
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
  addProduct,
  addInformation,
  updateStatus
}