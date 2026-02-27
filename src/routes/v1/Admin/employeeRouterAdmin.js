import express from 'express'
import { authenticateTokenAdmin } from '~/middlewares/authMiddleware'
import { employeeController } from '~/controllers/employeeController'
import { employeeValidation } from '~/validations/employeeValidation'

const Router = express.Router()

Router.use(authenticateTokenAdmin)

Router.route('/')
  .get(employeeController.getAllEmployees)
  .post(employeeValidation.createNew, employeeController.createNew)

Router.route('/getAllEmployeePage')
  .get(employeeController.getAllEmployeePage)

Router.route('/:id')
  .get(employeeController.getEmployeeById)
  // .put(employeeValidation.updateEmployee, employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee)

Router.route('/:id/updateRole')
  .put(employeeValidation.updateEmployeeRole, employeeController.updateEmployeeRole)

export const employeeRouterAdmin = Router