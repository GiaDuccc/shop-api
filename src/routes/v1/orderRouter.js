import express from 'express'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'

const Router = express.Router()

Router.route('/')
  .get(orderController.getAllOrdersPage)
  .post(orderValidation.createNew, orderController.createNew)

Router.route('/:id')
  .get(orderController.getDetails)
  .put(orderController.update) // update

Router.route('/:id/add-product')
  .put(orderValidation.addProduct, orderController.addProduct)

Router.route('/:id/remove-product')
  .put(orderController.removeProduct)

Router.route('/:id/increase-quantity')
  .put(orderController.increaseQuantity)

Router.route('/:id/decrease-quantity')
  .put(orderController.decreaseQuantity)

Router.route('/:id/add-information')
  .put(orderValidation.addInformation, orderController.addInformation)

Router.route('/:id/delete')
  .put(orderController.deleteOrder)

Router.route('/:id/updateStatus')
  .put(orderValidation.updateStatus, orderController.updateStatus)

export const orderRouter = Router
