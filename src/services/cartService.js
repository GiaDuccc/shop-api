import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cartModel } from '~/models/cartModel'
import { productModel } from '~/models/productModel'

const createNew = async (cartData) => {
  try {
    const newCart = await cartModel.createNew(cartData)
    const result = await cartModel.findOneById(newCart.insertedId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const addProductToCart = async (cartId, productData) => {
  try {
    const product = await productModel.findOneById(productData.productId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    await cartModel.addProductToCart(cartId, productData, product.price)
    return await cartModel.findOneById(cartId)
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const updateCart = async (cartId, updateData) => {
  try {
    const payload = { ...updateData, totalPrice: 0 }

    if (updateData.items.length > 0) {
      const prices = await Promise.all(
        updateData.items.map(async (item) => {
          const product = await productModel.findOneById(item.productId)
          if (!product) {
            throw new ApiError(
              StatusCodes.NOT_FOUND,
              `Product with ID ${item.productId} not found`
            )
          }
          return item.quantity * product.price
        })
      )

      payload.totalPrice = prices.reduce((a, b) => a + b, 0)
    }

    return await cartModel.updateCart(cartId, payload)
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


export const cartService = {
  createNew,
  addProductToCart,
  updateCart
}