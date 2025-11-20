import express from 'express'
import { cartController } from '~/controllers/cartController'
import { cartValidation } from '~/validations/cartValidation'

const Router = express.Router()

Router.route('/')
  .post(cartValidation.createNew, cartController.createNew)

Router.route('/findCartByCustomerId/:id')
  .get(cartController.findCartByCustomerId)

Router.route('/updateCart/:id')
  .put(cartValidation.updateCart, cartController.updateCart)

Router.route('/:id')
  .get(cartController.getCartDetail)

export const cartRouter = Router