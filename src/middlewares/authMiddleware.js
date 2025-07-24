import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { env } from '~/config/environment'
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Access token is required')
    }

    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token has expired')
        }
        throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid token')
      }

      req.user = decoded
      next()
    })
  } catch (error) {
    next(error)
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

export { authenticateToken, authorizeRoles }