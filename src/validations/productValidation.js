import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

// Schema cho từng size
const sizeSchema = Joi.object({
  size: Joi.number().positive().required()
    .messages({
      'number.base': 'Size must be a number',
      'number.positive': 'Size must be a positive number',
      'any.required': 'Size is required'
    }),
  quantity: Joi.number().min(0).required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity cannot be negative',
      'any.required': 'Quantity is required'
    })
})

// Schema cho từng color
const colorSchema = Joi.object({
  color: Joi.string().trim().required()
    .messages({
      'string.base': 'Color must be a string',
      'any.required': 'Color is required'
    }),
  colorHex: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#97bfc700'),
  imageDetail: Joi.array().items(
    Joi.string()
  ).max(6).default([]),
  sizes: Joi.array().items(sizeSchema).min(1).required()
    .messages({
      'array.base': 'Sizes must be an array',
      'array.min': 'At least one size is required'
    })
})

// Schema cho một product
const productSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must be at most 50 characters',
      'any.required': 'Name is required'
    }),
  highLight: Joi.string().max(255).trim().default(''),
  desc: Joi.string().trim().default(''),
  type: Joi.string().valid('sneaker', 'classic', 'running', 'basketball', 'football', 'boot')
    .required()
    .messages({
      'any.only': 'Type must be one of sneaker, classic, running, basketball, football, boot',
      'any.required': 'Type is required'
    }),
  adImage: Joi.string().default(''),
  navbarImage: Joi.string().default(''),
  brand: Joi.string().min(3).max(50).trim().required()
    .messages({
      'string.base': 'Brand must be a string',
      'string.empty': 'Brand cannot be empty',
      'string.min': 'Brand must be at least 3 characters',
      'string.max': 'Brand must be at most 50 characters',
      'any.required': 'Brand is required'
    }),
  price: Joi.number().min(0).required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required'
    }),
  stock: Joi.number().min(0).default(0),
  colors: Joi.array().items(colorSchema).min(1).required()
    .messages({
      'array.base': 'Colors must be an array',
      'array.min': 'At least one color is required',
      'any.required': 'Colors is required'
    })
})

const createNew = async (req, res, next) => {
  try {
    await productSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ') || 'Validation failed'
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    await productSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ') || 'Validation failed'
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const productValidation = {
  createNew,
  updateProduct
}