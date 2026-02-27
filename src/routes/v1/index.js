import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { productRouter as productRouterClient } from './Client/productRouter'
import { customerRouter as customerRouterClient } from './Client/customerRouter'
import { orderRouter as orderRouterClient } from './Client/orderRouter'
import { cartRouter as cartRouterClient } from './Client/cartRouter'
import { chatbotRouter as chatbotRouterClient } from './Client/chatbotRouter'
import { authRouter as authRouterClient } from './Client/authRouter'

import { productRouterAdmin } from './Admin/productRouterAdmin'
import { customerRouterAdmin } from './Admin/customerRouterAdmin'
import { orderRouterAdmin } from './Admin/orderRouterAdmin'
import { authRouterAdmin } from './Admin/authRouterAdmin'
import { employeeRouterAdmin } from './Admin/employeeRouterAdmin'

const Router = express.Router()
const adminRouter = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs_v1 are ready to use' })
})

Router.use('/products', productRouterClient)

Router.use('/customers', customerRouterClient)

Router.use('/orders', orderRouterClient)

Router.use('/carts', cartRouterClient)

Router.use('/chat', chatbotRouterClient)

Router.use('/auth', authRouterClient)

Router.use('/admin', adminRouter)

adminRouter.use('/products', productRouterAdmin)

adminRouter.use('/customers', customerRouterAdmin)

adminRouter.use('/orders', orderRouterAdmin)

adminRouter.use('/auth', authRouterAdmin)

adminRouter.use('/employees', employeeRouterAdmin)

export const APIs_v1 = Router
