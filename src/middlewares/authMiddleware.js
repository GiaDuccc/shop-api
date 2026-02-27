import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { env } from '~/config/environment'

const authenticateTokenClient = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access token client is missing'))
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET_CLIENT)
    if (decoded && typeof decoded === 'object') {
      const { sub, iat, exp } = decoded
      if (!sub) {
        return next(new ApiError(StatusCodes.FORBIDDEN, 'Invalid access token client payload'))
      }
      req.user = { sub: String(sub), iat, exp }
    }
    console.log('validate token client successfully')
    return next()
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access token client has expired'))
    }
    return next(new ApiError(StatusCodes.FORBIDDEN, 'Invalid access token client'))
  }
}

const authenticateTokenAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access token admin is missing'))
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET_ADMIN)
    if (decoded && typeof decoded === 'object') {
      const { sub, iat, exp } = decoded
      if (!sub) {
        return next(new ApiError(StatusCodes.FORBIDDEN, 'Invalid access token admin payload'))
      }
      req.user = { sub: String(sub), iat, exp }
    }
    console.log('validate token admin successfully')
    return next()
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access token admin has expired'))
    }
    return next(new ApiError(StatusCodes.FORBIDDEN, 'Invalid access token admin'))
  }
}

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated'))
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Insufficient permissions'))
    }

    next()
  }
}

export { authenticateTokenClient, authenticateTokenAdmin, authorizeRoles }