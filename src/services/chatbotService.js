import { StatusCodes } from 'http-status-codes'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '~/config/environment'
import { chatbotModel } from '~/models/chatbotModel'

// const chatbot = async (message) => {
//   const genAI = new GoogleGenerativeAI(env.GEMINI_KEY)
//   const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
//   const result = await model.generateContent(message)
//   const response = result.response
//   return response.text()
// }

const brands = ['nike', 'adidas', 'puma', 'converse']
const colors = ['white', 'đen', 'blue', 'đỏ']

const parseUserMessage = (message) => {
  const lower = message.toLowerCase()

  const brand = brands.find(b => lower.includes(b.toLowerCase()))
  const color = colors.find(c => lower.includes(c.toLowerCase()))
  const sizeMatch = lower.match(/size\s*(\d+)/)
  const size = sizeMatch ? sizeMatch[1] : null

  console.log(brand, color, size)

  return { brand, color, size }
}

const chatbot = async (message) => {
  const genAI = new GoogleGenerativeAI(env.GEMINI_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const { brand, color, size } = parseUserMessage(message)

  // Trường hợp thiếu thông tin
  if (!brand || !color || !size) {
    const missing = []
    if (!brand) missing.push('thương hiệu')
    if (!color) missing.push('màu sắc')
    if (!size) missing.push('size')
    return `Bạn vui lòng cung cấp thêm ${missing.join(', ')} để mình kiểm tra giúp nhé!`
  }

  // Tìm sản phẩm từ DB
  const product = await chatbotModel.findProduct({ brand, color, size })

  console.log(product)

  // Chuẩn bị prompt cho AI
  const prompt = product
    ? `Khách hỏi: "${message}". dữ liệu trả về thêm các trường là tên sản phẩm ${product.name}, giá ${product.price}, mô tả ${product.desc}, cái mô tả thì nói ngắn gọn thôi. Trả lời thân thiện như một người bán hàng để khách hàng có thể hiểu được thông tin. Nhiều nhất là 3 câu`
    : `Khách hỏi: "${message}". Trả lời rằng hiện tại shop không có sản phẩm như bạn đã yêu cầu. Hãy mời khách xem sản phẩm khác. Nói ngắn gọn nhất.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

export const chatbotService = {
  chatbot
}