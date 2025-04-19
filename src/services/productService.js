/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { productModel } from '~/models/productModel'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    let stock = 0
    reqBody.colors.forEach(color => {
      color.sizes.forEach(size => {
        stock += size.quantity
      })
    })

    const newProduct = {
      ...reqBody,
      slug: slugify(reqBody.name),
      stock: stock
    }

    const createProduct = await productModel.createNew(newProduct)

    const getNewProduct = await productModel.findOneById(createProduct.insertedId)

    return getNewProduct
  } catch (error) { throw error }
}

const getDetails = async (productId) => {
  try {
    // console.log('run service')
    const product = await productModel.getDetails(productId)

    if (!product) {
      throw new ApiError (StatusCodes.NOT_FOUND, 'Product not found!')
    }
    return product
  } catch (error) { throw error }
}

const getAllProduct = async () => {
  try {
    const products = await productModel.getAllProduct()

    if ( !products || products.length === 0 ) throw new ApiError( StatusCodes.NOT_FOUND, 'Products not found')
    return products
  } catch (error) { throw error }
}

const getAllProductFilter = async () => {
  try {
    const products = await productModel.getAllProductFilter()

    if ( !products || products.length === 0 ) throw new ApiError( StatusCodes.NOT_FOUND, 'Products not found')
    return products
  } catch (error) { throw error }
}

const getAllProductPage = async (page, limit, filters) => {
  try {
    const products = await productModel.getAllProductPage(page, limit, filters)

    // console.log(products)

    if ( !products ) throw new ApiError( StatusCodes.NOT_FOUND, 'Products not found')
    return products
  } catch (error) { throw error }
}

export const productService = {
  createNew,
  getDetails,
  getAllProduct,
  getAllProductPage,
  getAllProductFilter
}