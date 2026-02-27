/* eslint-disable no-unused-vars */
import express from 'express'
import { productController } from '~/controllers/productController'
import { productValidation } from '~/validations/productValidation'
import multer from 'multer'
import path from 'path'
import cloudinary from '~/utils/cloudinary'
import { Readable } from 'stream'
import { authenticateTokenClient } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(productController.getAllProduct)

Router.route('/getAllProductsBrand')
  .get(productController.getAllProductsBrand)

Router.route('/sliderType')
  .get(productController.getLimitedProductsController)

Router.route('/typeAndNavbarImageFromBrand')
  .get(productController.getTypeFromNavbar)

Router.route('/filter')
  .get(productController.getAllProductPage)

Router.route('/randomProductsWithBrand')
  .get(productController.getRandomProductsWithBrand)

Router.route('/searchProducts')
  .get(productController.searchProducts)

Router.route('/:id')
  .get(productController.getDetails)

Router.route('/:id/quantitySold')
  .put(productController.updateQuantitySold)


export const productRouter = Router
