/* eslint-disable no-useless-catch */
import { orderModel } from '~/models/orderModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Hàm lấy ngẫu nhiên 4 chữ số
// function getRandomDigits(str, length = 4) {
//   return Array.from({ length }, () => str[Math.floor(Math.random() * str.length)]).join('')
// }

const createNew = async (reqBody) => {
  try {
    const createdOrder = await orderModel.createNew(reqBody)

    const getNewOrder = await orderModel.findOneById(createdOrder.insertedId)

    return getNewOrder
  } catch (error) { throw error }
}

const getAllOrdersPage = async (page, limit, filters) => {
  try {
    const orders = await orderModel.getAllOrdersPage(page, limit, filters)

    if (!orders) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Orders is not found!')
    }
    return orders
  } catch (error) { throw error }
}

const getDetails = async (orderId) => {
  try {
    const order = await orderModel.getDetails(orderId)

    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order is not found!')
    }

    return order
  } catch (error) { throw error }
}

const addProduct = async (orderId, product) => {
  const updateOrder = await orderModel.addProduct(orderId, product)

  return updateOrder
}

const removeProduct = async (orderId, reqBody) => {
  const updateOrder = await orderModel.removeProduct(orderId, reqBody)

  return updateOrder
}

const increaseQuantity = async (orderId, { productId, color, size }) => {

  const updateOrder = await orderModel.increaseQuantity(orderId, { productId, color, size })

  return updateOrder
}

const decreaseQuantity = async (orderId, { productId, color, size }) => {

  const updateOrder = await orderModel.decreaseQuantity(orderId, { productId, color, size })

  return updateOrder
}

const addInformation = async (orderId, reqBody) => {

  const { name, phone, address } = reqBody
  const updateOrder = await orderModel.addInformation(orderId, { name, phone, address })

  return updateOrder
}

const update = async (orderId, totalPrice, payment) => {
  const updateOrder = await orderModel.update(orderId, totalPrice, payment)

  return updateOrder
}

const updateStatus = async (orderId, status) => {
  const updateOrder = await orderModel.updateStatus(orderId, status)

  return updateOrder
}

const deleteOrder = async (orderId) => {
  const updateOrder = await orderModel.deleteOrder(orderId)

  return updateOrder
}

const getOrderChartByDay = async () => {

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const orderChart = await orderModel.getOrderChartByDay(startOfToday, endOfToday)
  return orderChart
}

const getOrderChartByYear = async () => {

  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1)

  const orderChart = await orderModel.getOrderChartByYear(startOfYear, endOfYear)
  return orderChart
}

export const orderService = {
  createNew,
  getDetails,
  getAllOrdersPage,
  addProduct,
  increaseQuantity,
  decreaseQuantity,
  removeProduct,
  addInformation,
  update,
  deleteOrder,
  updateStatus,
  getOrderChartByDay,
  getOrderChartByYear
}