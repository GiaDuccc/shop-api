import { StatusCodes } from 'http-status-codes'
import { cartModel } from '~/models/cartModel'
import { cartService } from '~/services/cartService'

const createNew = async (req, res, next) => {
  try {
    const cartData = req.body
    const newCart = await cartService.createNew(cartData)
    res.status(StatusCodes.CREATED).json(newCart)
  } catch (error) {
    next(error)
  }
}

const getCartDetail = async (req, res, next) => {
  try {
    const cartId = req.params.id
    const cart = await cartModel.findOneById(cartId)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    next(error)
  }
}

const findCartByCustomerId = async (req, res, next) => {
  try {
    const customerId = req.params.id
    const cart = await cartModel.findCartByCustomerId(customerId)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    next(error)
  }
}

const updateCart = async (req, res, next) => {
  try {
    const cartId = req.params.id
    const updateData = req.body
    const updatedCart = await cartService.updateCart(cartId, updateData)
    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) {
    next(error)
  }
}

const addProductToCart = async (req, res, next) => {
  try {
    const cartId = req.params.id
    const productData = req.body
    const updatedCart = await cartService.addProductToCart(cartId, productData)
    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) {
    next(error)
  }
}

const removeProductFromCart = async (req, res, next) => {
  try {
    const cartId = req.params.id
    const productId = req.body.productId
    const updatedCart = await cartModel.removeProductFromCart(cartId, productId)
    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) {
    next(error)
  }
}

const deleteCart = async (req, res, next) => {
  try {
    const cartId = req.params.id
    await cartModel.deleteCart(cartId)
    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    next(error)
  }
}

const updateCartAfterCheckout = async (req, res, next) => {
  try {
    const cartId = req.params.id
    const updateData = req.body
    const updatedCart = await cartModel.updateCart(cartId, updateData)
    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) {
    next(error)
  }
}

export const cartController = {
  getCartDetail,
  createNew,
  findCartByCustomerId,
  updateCart,
  addProductToCart,
  removeProductFromCart,
  deleteCart,
  updateCartAfterCheckout
}