/* eslint-disable no-useless-catch */
import { orderModel } from '~/models/orderModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { Resend } from 'resend'

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

const update = async (orderId, totalPrice, payment) => {
  const updateOrder = await orderModel.update(orderId, totalPrice, payment)

  return updateOrder
}

const updateStatus = async (orderId, status) => {
  const updateOrder = await orderModel.updateStatus(orderId, status)

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

const sendEmail = async (emailData) => {
  console.log(emailData)
  const { toEmail, orderId, name, phone, address, payment, totalPrice, itemNumber } = emailData
  const resend = new Resend(process.env.RESEND_API_KEY)

  const response = await resend.emails.send({
    from: 'Nice Store <NiceStore@giaduccc.works>',
    to: toEmail,
    subject: 'Order Success!',
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;
              padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;
              background: #fafafa;">
    
    <h2 style="text-align: center; color: #2c3e50;">🎉 Order Placed Successfully!</h2>

    <p style="font-size: 15px; color: #333;">
      Hello <b>${name}</b>,
    </p>

    <p style="font-size: 15px; color: #333;">
      Thank you for shopping with us! Your order has been placed successfully.
    </p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

    <h3 style="color: #2c3e50;">📦 Order Information</h3>

    <p style="font-size: 15px; color: #333;">
      <b>Order ID:</b> ${orderId}
    </p>

    <p style="font-size: 15px; color: #333;">
      <b>Items:</b> ${itemNumber} item(s)
    </p>

    <p style="font-size: 15px; color: #333;">
      <b>Total Price:</b> ${totalPrice} VND
    </p>

    <p style="font-size: 15px; color: #333;">
      <b>Payment Method:</b> ${payment}
    </p>

    <h3 style="color: #2c3e50; margin-top: 25px;">👤 Customer Information</h3>

    <p style="font-size: 15px; color: #333;">
      <b>Name:</b> ${name}
    </p>

    <p style="font-size: 15px; color: #333;">
      <b>Phone:</b> ${phone}
    </p>

    <p style="font-size: 15px; color: #333;">
      <b>Address:</b> ${address}
    </p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 14px; color: #555; text-align: center;">
      If you have any questions, feel free to reply to this email.
      <br />Thank you for choosing our store! ❤️
    </p>

  </div>
`
  })

  console.log('thanh cong', response)
}

export const orderService = {
  createNew,
  getDetails,
  getAllOrdersPage,
  update,
  updateStatus,
  getOrderChartByDay,
  getOrderChartByYear,
  sendEmail
}