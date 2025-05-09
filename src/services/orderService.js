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

// const getAllOrders = async () => {
//   try {
//     const orders = await orderModel.getAllOrders()

//     if (!orders) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Order is not found!')
//     }
//     return orders
//   } catch (error) { throw error }
// }

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

const update = async (orderId, totalPrice) => {
  const updateOrder = await orderModel.update(orderId, totalPrice)

  return updateOrder
}

export const orderService = {
  createNew,
  getDetails,
  // getAllOrders,
  addProduct,
  increaseQuantity,
  decreaseQuantity,
  removeProduct,
  addInformation,
  update
}