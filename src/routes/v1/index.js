import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { productRouter } from './productRouter'
import { customerRouter } from './customerRouter'
import { orderRouter } from './orderRouter'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs_v1 are ready to use' })
})

Router.use('/products', productRouter)

Router.use('/customers', customerRouter)

Router.use('/orders', orderRouter)

export const APIs_v1 = Router
