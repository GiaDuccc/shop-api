/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { orderModel } from '~/models/orderModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Hàm lấy ngẫu nhiên 4 chữ số
function getRandomDigits(str, length = 4) {
  return Array.from({ length }, () => str[Math.floor(Math.random() * str.length)]).join('')
}

const createNew = async (reqBody) => {
  try {
    const newOrder = {
      ...reqBody,
      slug: slugify('Purchase-' + getRandomDigits(reqBody.customerId))
    }
    const createdOrder = await orderModel.createNew(newOrder)

    const getNewOrder = await orderModel.findOneById(createdOrder.insertedId)

    return getNewOrder
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

export const orderService = {
  createNew,
  getDetails
}