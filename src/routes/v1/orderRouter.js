import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list orders' })
  })
  .post(orderValidation.createNew, orderController.createNew)

Router.route('/:id')
  .get(orderController.getDetails)
  // .put(orderValidation.update, orderController.update) // update

export const orderRouter = Router
