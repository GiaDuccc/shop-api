import express from 'express'
import { authController } from '~/controllers/authController'
import { authenticateTokenAdmin } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/signInAdmin')
  .post(authController.signInAdmin)

// Router.route('/refreshTokenAdmin')
//   .post(authController.refreshTokenAdmin)

// Router.use(authenticateTokenAdmin)

// Router.route('/myInfo')
//   .get(authController.myInfo)

// Router.route('/signOutAdmin')
//   .post(authController.signOutAdmin)

export const authRouterAdmin = Router