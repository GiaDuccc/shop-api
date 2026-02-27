import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().max(256).required().trim().messages({
      'string.empty': 'firstName is required'
    }),
    lastName: Joi.string().max(256).required().trim().messages({
      'string.empty': 'lastName is required'
    }),
    dob: Joi.date().less('now').greater('1-1-1900').messages({
      'date.base': 'Date of birth must be a valid date',
      'date.less': 'Date of birth must be in the past',
      'any.required': 'Date of birth is required'
    }),
    email: Joi.string().email({ tlds: { allow: true } }).trim().lowercase().messages({
      'string.email': 'Email must be a valid email address'
    }),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
    address: Joi.string().max(512).required().trim().messages({
      'string.empty': 'address is required'
    }),
    role: Joi.string().valid('manager', 'admin', 'staff').required().messages({
      'any.only': 'role must be one of [manager, admin, staff]',
      'string.empty': 'role is required'
    }),
    salary: Joi.number().min(0).required().messages({
      'number.base': 'salary must be a number',
      'number.min': 'salary must be at least 0',
      'any.required': 'salary is required'
    })
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const updateEmployeeRole = async (req, res, next) => {
  const schema = Joi.object({
    role: Joi.string().valid('manager', 'admin', 'staff').required().messages({
      'any.only': 'role must be one of [manager, admin, staff]',
      'string.empty': 'role is required'
    })
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const employeeValidation = {
  createNew,
  updateEmployeeRole
}