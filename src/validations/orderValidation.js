import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    customerId: Joi.string().pattern(OBJECT_ID_RULE).message('Your string fails to match the customerId pattern!').required(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().pattern(OBJECT_ID_RULE).message('Your string fails to match the productId pattern!').required(),
        quantity: Joi.number().min(1).default(1).required(),
        price: Joi.number().min(0).required()
      })
    ).min(1).required()
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

export const orderValidation = {
  createNew
}