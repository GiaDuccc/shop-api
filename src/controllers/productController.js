import { StatusCodes } from 'http-status-codes'
import { productModel } from '~/models/productModel'
import { productService } from '~/services/productService'

const createNew = async (req, res, next) => {
  try {
    const createdProduct = await productService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdProduct)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    // console.log('req.params: ', req.params)
    const productId = req.params.id

    const product = await productService.getDetails(productId)

    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
  }
}

const getAllProduct = async (req, res, next) => {
  try {
    const products = await productService.getAllProduct()
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
  }
}

const getAllProductPage = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    // const limit = parseInt(req.query.limit) || 12
    const limit = 24

    // eslint-disable-next-line no-unused-vars
    let { page: _p, limit: _l, ...filters } = req.query

    const products = await productService.getAllProductPage(page, limit, filters)
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id
    const updateProduct = await productService.deleteProduct(productId)
    res.status(StatusCodes.OK).json(updateProduct)
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id
    const properties = req.body
    const updateProduct = await productService.updateProduct(productId, properties)
    res.status(StatusCodes.OK).json(updateProduct)
  } catch (error) { next(error) }
}

const updateQuantitySold = async (req, res, next) => {
  try {
    const productId = req.params.id
    const { quantity } = req.body

    const updateProduct = await productModel.updateQuantitySold(productId, quantity)
    res.status(StatusCodes.OK).json(updateProduct)
  } catch (error) { next(error) }
}

const getAllProductQuantity = async (req, res, next) => {
  try {
    const productQuantity = await productModel.getAllProductQuantity()
    res.status(StatusCodes.OK).json(productQuantity)
  } catch (error) { next(error) }
}

const getTopBestSeller = async (req, res, next) => {
  try {
    const topProduct = await productModel.getTopBestSeller()
    res.status(StatusCodes.OK).json(topProduct)
  } catch (error) { next(error) }
}

const getLimitedProductsController = async (req, res, next) => {
  const { brand, type } = req.query
  try {
    const products = await productService.getLimitedProducts(brand, type)
    res.status(StatusCodes.OK).json(products)
  } catch (error) { next(error) }
}

const getTypeFromNavbar = async (req, res, next) => {
  const { brand } = req.query
  try {
    const types = await productModel.getTypeFromNavbar(brand)
    res.status(StatusCodes.OK).json(types)
  } catch (error) { next(error) }
}

export const productController = {
  createNew,
  getDetails,
  getAllProduct,
  getAllProductPage,
  deleteProduct,
  updateProduct,
  updateQuantitySold,
  getAllProductQuantity,
  getTopBestSeller,
  getLimitedProductsController,
  getTypeFromNavbar
}