import express from 'express'
import { chatbotController } from '~/controllers/chatbotController'


const Router = express.Router()

Router.route('/')
  .post(chatbotController.chatbot)

export const chatbotRouter = Router
