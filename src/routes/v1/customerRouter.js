import express from 'express'
import { customerController } from '~/controllers/customerController'
import { customerValidation } from '~/validations/customerValidation'

const Router = express.Router()

Router.route('/')
  .get(customerController.getAllCustomerPage)
  .post(customerValidation.createNew, customerController.createNew)

Router.route('/:id')
  .get(customerController.getDetails)

Router.route('/login')
  .post(customerController.login)

Router.route('/:id/add-order')
  .put(customerValidation.addOrder, customerController.addOrder)

Router.route('/:id/update-order')
  .put(customerController.updateOrder)

Router.route('/:id/delete')
  .put(customerController.deleteCustomer)

Router.route('/:id/changeRole')
  .put(customerValidation.changeRole, customerController.changeRole)

export const customerRouter = Router
