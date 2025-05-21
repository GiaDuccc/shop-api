import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'

const createNew = async (req, res, next) => {
  try {
    const createdOrder = await orderService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdOrder)
  } catch (error) { next(Error) }
}

const getAllOrdersPage = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12

    // eslint-disable-next-line no-unused-vars
    let { page: _p, limit: _l, ...filters } = req.query

    const orders = await orderService.getAllOrdersPage(page, limit, filters)
    res.status(StatusCodes.OK).json(orders)
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

const addInformation = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const updateOrder = await orderService.addInformation(orderId, req.body)

    res.status(StatusCodes.OK).json(updateOrder)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { total, payment } = req.body
    const updateOrder = await orderService.update(orderId, total, payment)

    res.status(StatusCodes.OK).json(updateOrder)
  } catch (error) { next(error) }
}

const deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const updateOrder = await orderService.deleteOrder(orderId)
    res.status(StatusCodes.OK).json(updateOrder)
  } catch (error) { next(error) }
}

const updateStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { status } = req.body
    const updateOrder = await orderService.updateStatus(orderId, status)
    res.status(StatusCodes.OK).json(updateOrder)
  } catch (error) { next(error) }
}

export const orderController = {
  createNew,
  getAllOrdersPage,
  getDetails,
  addProduct,
  increaseQuantity,
  decreaseQuantity,
  removeProduct,
  addInformation,
  update,
  deleteOrder,
  updateStatus
}