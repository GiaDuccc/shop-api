import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { customerController } from '~/controllers/customerController'
import { customerValidation } from '~/validations/customerValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get customers list' })
  })
  .post(customerValidation.createNew, customerController.createNew)

Router.route('/:id')
  .get(customerController.getDetails)

export const customerRouter = Router
