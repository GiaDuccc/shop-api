import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

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

export const customerValidation = {
  createNew
}