/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { customerModel } from '~/models/customerModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'

const createNew = async (reqBody) => {
  try {
    const newCustomer = {
      ...reqBody,
      slug: slugify(`${reqBody.lastName}-${reqBody.firstName}`),
      password: await bcrypt.hashSync(reqBody.password, 10)
    }

    const createdCustomer = await customerModel.createNew(newCustomer)

    const getNewCustomer = await customerModel.findOneById(createdCustomer.insertedId)

    return getNewCustomer
  } catch (error) { throw error }
}

const getAllCustomerPage = async (page, limit, filters) => {
  try {
    const allCustomer = await customerModel.getAllCustomerPage(page, limit, filters)

    if (!allCustomer) throw new ApiError(StatusCodes.NOT_FOUND, 'We have zero Customer')

    return allCustomer
  } catch (error) { throw error }
}

const login = async (reqBody) => {
  try {
    const customerLogin = await customerModel.login(reqBody)

    if (!customerLogin) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Email or Password.')
    }

    return customerLogin
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

const addOrder = async (userId, order) => {
  const updateCustomer = await customerModel.addOrder(userId, order)

  return updateCustomer
}

const updateOrder = async (customerId, orderId, status) => {
  const updateCustomer = await customerModel.updateOrder(customerId, orderId, status)

  return updateCustomer
}

const deleteCustomer = async (customerId) => {
  const deleteCustomer = await customerModel.deleteCustomer(customerId)

  return deleteCustomer
}

const changeRole = async (customerId, role) => {
  const updateCustomer = await customerModel.changeRole(customerId, role)
  return updateCustomer
}

const getCustomerChartByDay = async () => {

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const updateCustomer = await customerModel.getCustomerChartByDay(startOfToday, endOfToday)
  return updateCustomer
}

const getCustomerChartByYear = async () => {

  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1)

  const updateCustomer = await customerModel.getCustomerChartByYear(startOfYear, endOfYear)
  return updateCustomer
}

export const customerService = {
  createNew,
  getAllCustomerPage,
  getDetails,
  login,
  addOrder,
  updateOrder,
  deleteCustomer,
  changeRole,
  getCustomerChartByDay,
  getCustomerChartByYear
}


