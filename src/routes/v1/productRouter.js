import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { productController } from '~/controllers/productController'
import { productValidation } from '~/validations/productValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get products list' })
  })
  .post(productValidation.createNew, productController.createNew)

Router.route('/:id')
  .get(productController.getDetails)

export const productRouter = Router
