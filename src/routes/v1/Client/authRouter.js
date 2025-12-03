import express from 'express'
import { authController } from '~/controllers/authController'
import { authenticateTokenClient } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/signInClient')
  .post(authController.signInClient)

Router.route('/refreshTokenClient')
  .post(authController.refreshTokenClient)

Router.use(authenticateTokenClient)

Router.route('/myInfo')
  .get(authController.myInfoClient)

Router.route('/signOutClient')
  .post(authController.signOutClient)


export const authRouter = Router