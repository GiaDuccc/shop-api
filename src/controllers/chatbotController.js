import { StatusCodes } from 'http-status-codes'
import { chatbotService } from '~/services/chatbotService'

const chatbot = async (req, res, next) => {
  try {
    const { message, conversation } = req.body
    const reply = await chatbotService.chatbot(message, conversation)
    res.status(StatusCodes.OK).json({ reply })
  } catch (error) { next(error) }
}

export const chatbotController = {
  chatbot
}