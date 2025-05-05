import express from 'express'
import { productController } from '~/controllers/productController'
import { productValidation } from '~/validations/productValidation'

const Router = express.Router()

Router.route('/')
  .get(productController.getAllProduct)
  .post(productValidation.createNew, productController.createNew)

Router.route('/filter')
  .get(productController.getAllProductPage)

Router.route('/:id')
  .get(productController.getDetails)

export const productRouter = Router
