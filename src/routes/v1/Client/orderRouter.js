import express from 'express'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'
import { authenticateTokenClient } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(orderValidation.createNew, orderController.createNew)

Router.use(authenticateTokenClient)

Router.route('/sendEmail')
  .post(orderController.sendEmail)

Router.route('/getCustomerOrders/:id')
  .get(orderController.getCustomerOrders)

Router.route('/:id')
  .get(orderController.getDetails)
  .put(orderController.update) // update

export const orderRouter = Router
