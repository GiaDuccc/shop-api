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

export const orderController = {
  createNew,
  getDetails
}