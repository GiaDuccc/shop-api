import express from 'express'
import { chatbotController } from '~/controllers/chatbotController'


const Router = express.Router()

Router.route('/')
  // .get(chatbotController.chatbot)
  .post(chatbotController.chatbot)

export const chatbotRouter = Router
