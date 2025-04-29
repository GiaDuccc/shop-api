import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'

const createNew = async (req, res, next) => {
  try {
    const createdOrder = await orderService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdOrder)
  } catch (error) { next(Error) }
}

const getDetails = async (req, res, next) => {
  try {
    const orderId = req.params.id

    const order = await orderService.getDetails(orderId)

    res.status(StatusCodes.OK).json(order)
  } catch (error) { next(error) }
}

const addProduct = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const updateOrder = await orderService.addProduct(orderId, req.body)

    res.status(StatusCodes.OK).json(updateOrder)
  } catch (error) { next(error) }
}

const removeProduct = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const updateOrder = await orderService.removeProduct(orderId, req.body)

    res.status(StatusCodes.OK).json(updateOrder)
  } catch (error) { next(error) }
}

const increaseQuantity = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { productId, color, size } = req.body
    const updateOrder = await orderService.increaseQuantity(orderId, { productId, color, size })

    res.status(StatusCodes.OK).json(updateOrder)
  } catch (error) { next(error) }
}

const decreaseQuantity = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { productId, color, size } = req.body
    const updateOrder = await orderService.decreaseQuantity(orderId, { productId, color, size })

    res.status(StatusCodes.OK).json(updateOrder)
  } catch (error) { next(error) }
}

export const orderController = {
  createNew,
  getDetails,
  addProduct,
  increaseQuantity,
  decreaseQuantity,
  removeProduct
}