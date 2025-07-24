import express from 'express'
import { customerController } from '~/controllers/customerController'
import { customerValidation } from '~/validations/customerValidation'
import { authenticateToken, authorizeRoles } from '~/middlewares/authMiddleware'
import { loginLimiter, registerLimiter } from '~/middlewares/rateLimitMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authenticateToken, authorizeRoles('admin', 'manager'), customerController.getAllCustomerPage)
  .post(registerLimiter, customerValidation.createNew, customerController.createNew)

Router.route('/allCustomerQuantity')
  .get(authenticateToken, authorizeRoles('admin', 'manager'), customerController.getAllCustomerQuantity)

Router.route('/customerChartByDay')
  .get(authenticateToken, authorizeRoles('admin', 'manager'), customerController.getCustomerChartByDay)

Router.route('/customerChartByYear')
  .get(authenticateToken, authorizeRoles('admin', 'manager'), customerController.getCustomerChartByYear)

Router.route('/login')
  .post(loginLimiter, customerController.login)

Router.route('/logout')
  .post(authenticateToken, customerController.logout)

Router.route('/refresh-token')
  .post(customerController.refreshToken)

Router.route('/:id')
  .get(authenticateToken, customerController.getDetails)

Router.route('/:id/updateCustomer')
  .put(authenticateToken, customerValidation.updateCustomer, customerController.updateCustomer)

Router.route('/:id/add-order')
  .put(authenticateToken, customerValidation.addOrder, customerController.addOrder)

Router.route('/:id/update-order')
  .put(authenticateToken, customerController.updateOrder)

Router.route('/:id/delete')
  .put(authenticateToken, authorizeRoles('admin', 'manager'), customerController.deleteCustomer)

Router.route('/:id/changeRole')
  .put(authenticateToken, authorizeRoles('admin', 'manager'), customerValidation.changeRole, customerController.changeRole)

export const customerRouter = Router
