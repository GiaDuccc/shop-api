import express from 'express'
import { customerController } from '~/controllers/customerController'
import { customerValidation } from '~/validations/customerValidation'
import { authenticateTokenAdmin } from '~/middlewares/authMiddleware'
// import { registerLimiter } from '~/middlewares/rateLimitMiddleware'

const Router = express.Router()

Router.use(authenticateTokenAdmin)

Router.route('/')
  .get(customerController.getAllCustomerPage)
  .post(customerValidation.createNew, customerController.createNew)

Router.route('/allCustomerQuantity')
  .get(customerController.getAllCustomerQuantity)

// Router.route('/customerChartByDay')
//   .get(customerController.getCustomerChartByDay)

Router.route('/customerChartByYear')
  .get(customerController.getCustomerChartByYear)

Router.route('/:id')
  .get(customerController.getDetails)
  .delete(customerController.deleteCustomer)

Router.route('/:id/updateCustomer')
  .put(customerValidation.updateCustomer, customerController.updateCustomer)

// Router.route('/:id/delete')
//   .put(customerController.deleteCustomer)

export const customerRouterAdmin = Router
