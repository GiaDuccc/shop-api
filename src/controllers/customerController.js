import { StatusCodes } from 'http-status-codes'
import { customerService } from '~/services/customerService'

const createNew = async (req, res, next) => {
  try {
    // console.log(req.body)

    const createdCustomer = await customerService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdCustomer)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const customerLogin = await customerService.login(req.body)
    res.status(StatusCodes.OK).json(customerLogin)
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
  getDetails,
  login
}