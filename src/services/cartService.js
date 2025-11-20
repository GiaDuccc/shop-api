import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cartModel } from '~/models/cartModel'
import { productModel } from '~/models/productModel'

const createNew = async (cartData) => {
  try {

    const itemPrices = await Promise.all(
      cartData.items.map(async item => {
        const product = await productModel.findOneById(item.productId)
        return product.price
      })
    )

    const payload = {
      ...cartData,
      totalPrice: itemPrices.reduce((acc, price) => acc + price, 0)
    }

    const newCart = await cartModel.createNew(payload)
    const result = await cartModel.findOneById(newCart.insertedId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const cartService = {
  createNew
}