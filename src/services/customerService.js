/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { customerModel } from '~/models/customerModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newCustomer = {
      ...reqBody,
      slug: slugify(reqBody.userName)
    }

    const createdCustomer = await customerModel.createNew(newCustomer)

    const getNewCustomer = await customerModel.findOneById(createdCustomer.insertedId)

    return getNewCustomer
  } catch (error) { throw error }
}

const getDetails = async (customerId) => {
  try {
    const customer = await customerModel.getDetails(customerId)

    if (!customer) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found!')
    }

    return customer
  } catch (error) { throw error }
}

export const customerService = {
  createNew,
  getDetails
}