import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { productController } from '~/controllers/productController'
import { productValidation } from '~/validations/productValidation'

const Router = express.Router()

Router.route('/')
  .get(productController.getAllProductPage)
  .post(productValidation.createNew, productController.createNew)

Router.route('/filter')
  .get(productController.getAllProduct)

Router.route('/:id')
  .get(productController.getDetails)

export const productRouter = Router
