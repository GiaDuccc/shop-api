import express from 'express'
import { customerController } from '~/controllers/customerController'
import { customerValidation } from '~/validations/customerValidation'
import { authenticateTokenClient } from '~/middlewares/authMiddleware'
// import { registerLimiter } from '~/middlewares/rateLimitMiddleware'

const Router = express.Router()

Router.route('/')
  // .get(customerController.getAllCustomerPage)
  .post(customerValidation.createNew, customerController.createNew)

Router.use(authenticateTokenClient)

// Router.route('/allCustomerQuantity')
//   .get(customerController.getAllCustomerQuantity)

// Router.route('/customerChartByDay')
//   .get(customerController.getCustomerChartByDay)

// Router.route('/customerChartByYear')
//   .get(customerController.getCustomerChartByYear)

Router.route('/:id')
  .get(customerController.getDetails)

Router.route('/:id/updateCustomer')
  .put(customerValidation.updateCustomer, customerController.updateCustomer)

// Router.route('/:id/delete')
//   .put(customerController.deleteCustomer)

export const customerRouter = Router
