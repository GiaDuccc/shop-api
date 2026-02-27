import { StatusCodes } from 'http-status-codes'
import { orderModel } from '~/models/orderModel'
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
    const updateOrder = await orderModel.deleteOrder(orderId)
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

const getQuantityAndProfit = async (req, res, next) => {
  try {
    const quantityAndProfit = await orderModel.getQuantityAndProfit()
    res.status(StatusCodes.OK).json(quantityAndProfit)
  } catch (error) { next(error) }
}

const getOrderChartByDay = async (req, res, next) => {
  try {
    const orders = await orderService.getOrderChartByDay()
    res.status(StatusCodes.OK).json(orders)
  } catch (error) { next(error) }
}

const getOrderChartByYear = async (req, res, next) => {
  try {
    const orders = await orderService.getOrderChartByYear()
    res.status(StatusCodes.OK).json(orders)
  } catch (error) { next(error) }
}

const getCustomerOrders = async (req, res, next) => {
  try {
    const customerId = req.params.id
    const orders = await orderModel.getCustomerOrders(customerId)
    res.status(StatusCodes.OK).json(orders)
  } catch (error) { next(error) }
}

const sendEmail = async (req, res, next) => {
  try {
    await orderService.sendEmail(req.body)
    res.status(StatusCodes.OK).json('Email sent successfully')
  } catch (error) {
    next(error)
  }
}

export const orderController = {
  createNew,
  getAllOrdersPage,
  getDetails,
  update,
  deleteOrder,
  updateStatus,
  getQuantityAndProfit,
  getOrderChartByDay,
  getOrderChartByYear,
  getCustomerOrders,
  sendEmail
}