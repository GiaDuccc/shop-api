import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    userName: Joi.string().required().min(5).max(50).trim().strict(),
    password: Joi.string().required().min(8).max(256).trim().strict()
    // email: Joi.string().email({ tlds: { allow: false } }).trim().lowercase().messages({
    //   'string.email': 'Email must be a valid email address'
    // }),
    // role: Joi.string().valid('admin', 'client').default('client').required(),

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

export const customerValidation = {
  createNew
}