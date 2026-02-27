import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import ApiError from '~/utils/ApiError'

const signInClient = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const signInResult = await authService.signInClient(username, password)
    const { accessTokenClient, refreshTokenClient, customer } = signInResult
    res.cookie('refreshTokenClient', refreshTokenClient, {
      httpOnly: true,
      secure: true, // true nếu có HTTPS
      sameSite: 'none',
      maxAge: 6 * 60 * 60 * 1000 // 6 hours
    })

    res.status(StatusCodes.OK).json({
      introduce: `Welcome back ${customer.lastName} ${customer.firstName}!`,
      message: 'Sign in success',
      accessTokenClient,
      customer
    })
  } catch (error) { next(error) }
}

const refreshTokenClient = async (req, res, next) => {
  try {
    console.log('chay refreshToken')
    const refreshToken = req.cookies.refreshTokenClient
    if (!refreshToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'No token')
    const result = await authService.refreshTokenClient(refreshToken)
    const { newAccessTokenClient, newRefreshTokenClient, customer } = result

    res.cookie('refreshTokenClient', newRefreshTokenClient, {
      httpOnly: true,
      secure: true, // true nếu có HTTPS
      sameSite: 'none',
      maxAge: 6 * 60 * 60 * 1000 // 6 hours
    })
    res.status(StatusCodes.OK).json({
      introduce: `Welcome back ${customer.lastName} ${customer.firstName}!`,
      message: 'Token refreshed successfully',
      accessTokenClient: newAccessTokenClient,
      customer
    })
  } catch (error) { next(error) }
}

const signOutClient = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshTokenClient
    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No refresh token provided' })
    }
    await authService.signOutClient(refreshToken)
    res.clearCookie('refreshTokenClient')
    res.status(StatusCodes.OK).json({ message: 'Sign out success' })
  } catch (error) {
    next(error)
  }
}

const myInfoClient = async (req, res, next) => {
  try {
    const myInfo = await authService.getCustomerInfoByToken(req.headers.authorization.toString())
    res.status(StatusCodes.OK).json(myInfo)
  } catch (error) {
    next(error)
  }
}

const signInAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const signInResult = await authService.signInAdmin(username, password)
    const { accessTokenAdmin, refreshTokenAdmin, employee } = signInResult
    res.cookie('refreshTokenAdmin', refreshTokenAdmin, {
      httpOnly: true,
      secure: true, // true nếu có HTTPS
      sameSite: 'none',
      maxAge: 1 * 60 * 60 * 1000 // 1 hour
    })

    res.status(StatusCodes.OK).json({
      introduce: `Welcome back ${employee.lastName} ${employee.firstName}!`,
      message: 'Sign in success',
      accessTokenAdmin,
      employee
    })
  } catch (error) {
    next(error)
  }
}

const refreshTokenAdmin = async (req, res, next) => {
  try {
    console.log('chay refreshTokenAdmin')
    const refreshToken = req.cookies.refreshTokenAdmin
    if (!refreshToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'No token')
    const result = await authService.refreshTokenAdmin(refreshToken)
    const { newAccessTokenAdmin, newRefreshTokenAdmin, employee } = result

    res.cookie('refreshTokenAdmin', newRefreshTokenAdmin, {
      httpOnly: true,
      secure: true, // true nếu có HTTPS
      sameSite: 'none',
      maxAge: 1 * 60 * 60 * 1000 // 1 hour
    })
    res.status(StatusCodes.OK).json({
      introduce: `Welcome back ${employee.lastName} ${employee.firstName}!`,
      message: 'Token refreshed successfully',
      accessTokenAdmin: newAccessTokenAdmin,
      employee
    })
  } catch (error) { next(error) }
}

const signOutAdmin = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshTokenAdmin
    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No refresh token provided' })
    }
    await authService.signOutAdmin(refreshToken)
    res.clearCookie('refreshTokenAdmin')
    res.status(StatusCodes.OK).json({ message: 'Sign out success' })
  } catch (error) {
    next(error)
  }
}

const myInfoAdmin = async (req, res, next) => {
  try {
    const myInfo = await authService.getEmployeeInfoByToken(req.headers.authorization.toString())
    res.status(StatusCodes.OK).json(myInfo)
  } catch (error) {
    next(error)
  }
}

export const authController = {
  signInClient,
  refreshTokenClient,
  signOutClient,
  myInfoClient,
  signInAdmin,
  refreshTokenAdmin,
  signOutAdmin,
  myInfoAdmin
}