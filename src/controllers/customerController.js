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

const addOrder = async (req, res, next) => {
  try {
    const userId = req.params.id
    const updateCustomer = await customerService.addOrder(userId, req.body)

    res.status(StatusCodes.OK).json(updateCustomer)
  } catch (error) { next(error) }
}

const updateOrder = async (req, res, next) => {
  try {
    const customerId = req.params.id
    const { orderId } = req.body
    const updateCustomer = await customerService.updateOrder(customerId, orderId)

    res.status(StatusCodes.OK).json(updateCustomer)
  } catch (error) { next(error) }
}

export const customerController = {
  createNew,
  getDetails,
  login,
  addOrder,
  updateOrder
}