import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

const ACCESS_TOKEN_SECRET_CLIENT = env.JWT_ACCESS_SECRET_CLIENT
const REFRESH_TOKEN_SECRET_CLIENT = env.JWT_REFRESH_SECRET_CLIENT
const ACCESS_TOKEN_SECRET_ADMIN = env.JWT_ACCESS_SECRET_ADMIN
const REFRESH_TOKEN_SECRET_ADMIN = env.JWT_REFRESH_SECRET_ADMIN

const generateAccessTokenClient = (customer) => {

  return jwt.sign(
    { sub: customer._id.toString() },
    ACCESS_TOKEN_SECRET_CLIENT,
    { expiresIn: '1m' }
  )
}

const generateRefreshTokenClient = (customer) => {
  return jwt.sign(
    { sub: customer._id.toString() },
    REFRESH_TOKEN_SECRET_CLIENT,
    { expiresIn: '6h' }
  )
}

const verifyAccessTokenClient = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET_CLIENT)
}

const verifyRefreshTokenClient = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET_CLIENT)
}

const generateAccessTokenAdmin = (employee) => {
  return jwt.sign(
    { sub: employee._id, role: employee.role },
    ACCESS_TOKEN_SECRET_ADMIN,
    { expiresIn: '1m' }
  )
}

const generateRefreshTokenAdmin = (employee) => {
  return jwt.sign(
    { sub: employee._id, role: employee.role },
    REFRESH_TOKEN_SECRET_ADMIN,
    { expiresIn: '1h' }
  )
}

const verifyAccessTokenAdmin = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET_ADMIN)
}

const verifyRefreshTokenAdmin = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET_ADMIN)
}

export const token = {
  generateAccessTokenClient,
  generateRefreshTokenClient,
  verifyAccessTokenClient,
  verifyRefreshTokenClient,
  generateAccessTokenAdmin,
  generateRefreshTokenAdmin,
  verifyAccessTokenAdmin,
  verifyRefreshTokenAdmin
}