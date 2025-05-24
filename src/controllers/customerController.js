import { StatusCodes } from 'http-status-codes'
import { customerModel } from '~/models/customerModel'
import { customerService } from '~/services/customerService'

const createNew = async (req, res, next) => {
  try {
    // console.log(req.body)

    const createdCustomer = await customerService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdCustomer)
  } catch (error) { next(error) }
}

const getAllCustomerPage = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12

    // eslint-disable-next-line no-unused-vars
    let { page: _p, limit: _l, ...filters } = req.query

    const allCustomer = await customerService.getAllCustomerPage(page, limit, filters)
    res.status(StatusCodes.OK).json(allCustomer)
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
    const { orderId, status } = req.body
    const updateCustomer = await customerService.updateOrder(customerId, orderId, status)

    res.status(StatusCodes.OK).json(updateCustomer)
  } catch (error) { next(error) }
}

const deleteCustomer = async (req, res, next) => {
  try {

    const customerId = req.params.id

    const deleteCustomer = await customerService.deleteCustomer(customerId)

    res.status(StatusCodes.OK).json(deleteCustomer)
  } catch (error) { next(error) }
}

const changeRole = async (req, res, next) => {
  try {
    const customerId = req.params.id
    const { role } = req.body

    const updateCustomer = await customerService.changeRole(customerId, role)
    res.status(StatusCodes.OK).json(updateCustomer)

  } catch (error) { next(error) }
}

const getAllCustomerQuantity = async (req, res, next) => {
  try {
    const customerQuantity = await customerModel.getAllCustomerQuantity()
    res.status(StatusCodes.OK).json(customerQuantity)
  } catch (error) { next(error) }
}

const getCustomerChartByDay = async (req, res, next) => {
  try {
    const customers = await customerService.getCustomerChartByDay()
    res.status(StatusCodes.OK).json(customers)
  } catch (error) { next(error) }
}

// const getCustomerChartByMonth = async (req, res, next) => {
//   try {
//     const customers = await customerService.getCustomerChartByMonth()
//     res.status(StatusCodes.OK).json(customers)
//   } catch (error) { next(error) }
// }

const getCustomerChartByYear = async (req, res, next) => {
  try {
    const customers = await customerService.getCustomerChartByYear()
    res.status(StatusCodes.OK).json(customers)
  } catch (error) { next(error) }
}

const updateCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id
    const { properties } = req.body

    const updateCustomer = await customerModel.updateCustomer(customerId, properties)
    res.status(StatusCodes.OK).json(updateCustomer)
  } catch (error) { next(error) }
}

export const customerController = {
  createNew,
  getAllCustomerPage,
  getDetails,
  login,
  addOrder,
  updateOrder,
  deleteCustomer,
  changeRole,
  getAllCustomerQuantity,
  getCustomerChartByDay,
  // getCustomerChartByMonth,
  getCustomerChartByYear,
  updateCustomer
}