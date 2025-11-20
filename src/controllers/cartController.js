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
  updateCart
}