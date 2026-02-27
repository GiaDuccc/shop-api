/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { customerModel } from '~/models/customerModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
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
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: customerLogin._id,
        email: customerLogin.email,
        role: customerLogin.role
      },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Tạo refresh token
    const refreshToken = jwt.sign(
      { userId: customerLogin._id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    // Lưu refresh token vào database (optional)
    await customerModel.updateRefreshToken(customerLogin._id, refreshToken)

    // Trả về thông tin an toàn
    return {
      token,
      refreshToken,
      user: {
        _id: customerLogin._id,
        email: customerLogin.email,
        firstName: customerLogin.firstName,
        lastName: customerLogin.lastName,
        role: customerLogin.role,
        phone: customerLogin.phone
      }
    }
  } catch (error) { throw error }
}

const logout = async (userId) => {
  try {
    // Xóa refresh token
    await customerModel.updateRefreshToken(userId, null)
    return { message: 'Logged out successfully' }
  } catch (error) { throw error }
}

const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET)
    const user = await customerModel.findOneById(decoded.userId)

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }

    // Tạo token mới
    const newToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    return { token: newToken }
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
  logout,
  refreshToken,
  getCustomerChartByDay,
  getCustomerChartByYear
}


