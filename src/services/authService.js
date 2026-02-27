import { StatusCodes } from 'http-status-codes'
import { customerModel } from '~/models/customerModel'
import { employeeModel } from '~/models/employeeModel'
import ApiError from '~/utils/ApiError'
import { token } from '~/utils/token'

const signInClient = async (username, password) => {
  try {
    const customer = await customerModel.signIn(username, password)

    if (!customer) {
      throw new ApiError(401, 'Invalid Username or Password.')
    }

    const accessTokenClient = token.generateAccessTokenClient(customer)

    const refreshTokenClient = token.generateRefreshTokenClient(customer)

    await customerModel.updateRefreshToken(customer._id, refreshTokenClient)
    return { accessTokenClient, refreshTokenClient, customer }
  } catch (error) {
    if (error instanceof ApiError) { throw error }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const refreshTokenClient = async (refreshToken) => {
  try {
    const decoded = token.verifyRefreshTokenClient(refreshToken)

    if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }

    const customer = await customerModel.findOneById(decoded.sub)
    if (!customer) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'The customer no longer exists')
    }
    const customerRefreshToken = customer.refreshToken || ''
    if (customerRefreshToken !== refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }
    const newAccessTokenClient = token.generateAccessTokenClient(customer)
    const newRefreshTokenClient = token.generateRefreshTokenClient(customer)
    await customerModel.updateRefreshToken(customer._id, newRefreshTokenClient)
    return { newAccessTokenClient, newRefreshTokenClient, customer }
  } catch (error) {
    if (error instanceof ApiError) { throw error }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const signOutClient = async (refreshToken) => {
  try {
    const decoded = token.verifyRefreshTokenClient(refreshToken)
    if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }
    await customerModel.updateRefreshToken(decoded.sub, null)
  } catch (error) {
    if (error instanceof ApiError) { throw error }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getCustomerInfoByToken = async (accessToken) => {
  try {
    const decoded = token.verifyAccessTokenClient(accessToken.split(' ')[1])
    if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }
    const customer = await customerModel.findOneById(decoded.sub)
    if (!customer) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'The customer no longer exists')
    }
    return customer
  } catch (error) {
    if (error instanceof ApiError) { throw error }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const signInAdmin = async (username, password) => {
  try {
    const employee = await employeeModel.signIn(username, password)

    if (!employee) {
      throw new ApiError(401, 'Invalid Username or Password.')
    }

    const accessTokenAdmin = token.generateAccessTokenAdmin(employee)

    const refreshTokenAdmin = token.generateRefreshTokenAdmin(employee)

    await employeeModel.updateRefreshToken(employee._id, refreshTokenAdmin)
    return { accessTokenAdmin, refreshTokenAdmin, employee }
  } catch (error) {
    if (error instanceof ApiError) { throw error }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


const refreshTokenAdmin = async (refreshToken) => {
  try {
    const decoded = token.verifyRefreshTokenAdmin(refreshToken)

    if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }

    const employee = await employeeModel.findOneById(decoded.sub)
    if (!employee) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'The employee no longer exists')
    }
    const employeeRefreshToken = employee.refreshToken || ''
    if (employeeRefreshToken !== refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }
    const newAccessTokenAdmin = token.generateAccessTokenAdmin(employee)
    const newRefreshTokenAdmin = token.generateRefreshTokenAdmin(employee)
    await employeeModel.updateRefreshToken(employee._id, newRefreshTokenAdmin)
    return { newAccessTokenAdmin, newRefreshTokenAdmin, employee }
  } catch (error) {
    if (error instanceof ApiError) { throw error }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const signOutAdmin= async (refreshToken) => {
  try {
    const decoded = token.verifyRefreshTokenAdmin(refreshToken)
    if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }
    await employeeModel.updateRefreshToken(decoded.sub, null)
  } catch (error) {
    if (error instanceof ApiError) { throw error }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getEmployeeInfoByToken = async (accessToken) => {
  try {
    const decoded = token.verifyAccessTokenAdmin(accessToken.split(' ')[1])
    if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }
    const employee = await employeeModel.findOneById(decoded.sub)
    if (!employee) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'The employee no longer exists')
    }
    return employee
  } catch (error) {
    if (error instanceof ApiError) { throw error }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const authService = {
  signInClient,
  refreshTokenClient,
  signOutClient,
  getCustomerInfoByToken,
  signInAdmin,
  refreshTokenAdmin,
  signOutAdmin,
  getEmployeeInfoByToken
}