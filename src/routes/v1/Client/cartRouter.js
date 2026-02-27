import express from 'express'
import { cartController } from '~/controllers/cartController'
import { cartValidation } from '~/validations/cartValidation'
import { authenticateTokenClient } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.use(authenticateTokenClient)
Router.route('/')
  .post(cartValidation.createNew, cartController.createNew)

Router.route('/findCartByCustomerId/:id')
  .get(cartController.findCartByCustomerId)

Router.route('/updateCart/:id')
  .put(cartValidation.updateCart, cartController.updateCart)

Router.route('/addProductToCart/:id')
  .post(cartValidation.addProductToCart, cartController.addProductToCart)

Router.route('/removeProductFromCart/:id')
  .delete(cartController.removeProductFromCart)

Router.route('/updateCartAfterCheckout/:id')
  .put(cartValidation.updateCartAfterCheckout, cartController.updateCartAfterCheckout)

Router.route('/:id')
  .get(cartController.getCartDetail)
  .delete(cartController.deleteCart)

export const cartRouter = Router