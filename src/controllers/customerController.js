import { StatusCodes } from 'http-status-codes'
import { customerService } from '~/services/customerService'

const createNew = async (req, res, next) => {
  try {
    const createdCustomer = await customerService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdCustomer)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const customerId = req.params.id

    const customer = await customerService.getDetails(customerId)

    res.status(StatusCodes.OK).json(customer)
  } catch (error) {
    next(error)
  }
}

export const customerController = {
  createNew,
  getDetails
}