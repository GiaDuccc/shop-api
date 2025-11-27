import express from 'express'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'

const Router = express.Router()

Router.route('/')
  .get(orderController.getAllOrdersPage)
  .post(orderValidation.createNew, orderController.createNew)


Router.route('/quantityAndProfit')
  .get(orderController.getQuantityAndProfit)

Router.route('/orderChartByDay')
  .get(orderController.getOrderChartByDay)

Router.route('/orderAndProductSoldChartByYear')
  .get(orderController.getOrderChartByYear)

Router.route('/getCustomerOrders/:id')
  .get(orderController.getCustomerOrders)

Router.route('/:id')
  .get(orderController.getDetails)
  .put(orderController.update) // update

Router.route('/:id/delete')
  .put(orderController.deleteOrder)

Router.route('/:id/updateStatus')
  .put(orderValidation.updateStatus, orderController.updateStatus)

export const orderRouter = Router
