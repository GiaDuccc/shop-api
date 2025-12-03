import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { productRouter as productRouterClient } from './Client/productRouter'
import { customerRouter as customerRouterClient } from './Client/customerRouter'
import { orderRouter as orderRouterClient } from './Client/orderRouter'
import { cartRouter as cartRouterClient } from './Client/cartRouter'
import { chatbotRouter as chatbotRouterClient } from './Client/chatbotRouter'
import { authRouter as authRouterClient } from './Client/authRouter'

import { productRouter as productRouterAdmin } from './Admin/productRouterAdmin'
import { customerRouter as customerRouterAdmin } from './Admin/customerRouterAdmin'
import { orderRouter as orderRouterAdmin } from './Admin/orderRouterAdmin'
import { authRouterAdmin as authRouterAdmin } from './Admin/authRouterAdmin'


const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs_v1 are ready to use' })
})

Router.use('/products', productRouterClient)

Router.use('/customers', customerRouterClient)

Router.use('/orders', orderRouterClient)

Router.use('/carts', cartRouterClient)

Router.use('/chat', chatbotRouterClient)

Router.use('/auth', authRouterClient)

Router.use('/admin/products', productRouterAdmin)

Router.use('/admin/customers', customerRouterAdmin)

Router.use('/admin/orders', orderRouterAdmin)

Router.use('/admin/auth', authRouterAdmin)

export const APIs_v1 = Router
