import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list order' })
  })
  .post(orderValidation.createNew, orderController.createNew)

Router.route('/:id')
  .get(orderController.getDetails)
// .put(orderValidation.update, orderController.update) // update

Router.route('/:id/add-product')
  .put(orderValidation.addProduct, orderController.addProduct)

Router.route('/:id/remove-product')
  .put(orderController.removeProduct)

Router.route('/:id/increase-quantity')
  .put(orderController.increaseQuantity)

Router.route('/:id/decrease-quantity')
  .put(orderController.decreaseQuantity)

export const orderRouter = Router
