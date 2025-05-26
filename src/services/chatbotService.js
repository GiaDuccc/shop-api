import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '~/config/environment'
import { chatbotModel } from '~/models/chatbotModel'

const chatbot = async (message, conversation) => {
  const genAI = new GoogleGenerativeAI(env.GEMINI_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Here is request: ${message}, here is old conversation ${JSON.stringify(conversation, null, 2)}. Figure out whether the customer is talking about an old product or a new one. You must switch to strict mode: analyse the user's search request to extract the following attributes: brand, name, color, size. Return the result strictly in the following format: {
  brand: ...,
  name: ...,
  color: ...,
  size: ...
}, The name must have each word capitalized. If any attribute is not found, set its value to ''. Do not add explanations, descriptions, or anything else, Return only data inside { }. Values are converted to lowercase and english.`

  let res = ''
  const request = await model.generateContent(prompt)
  try {
    const cleaned = JSON.parse(request.response.text().replace(/```json\s*|\s*```/g, ''))
    // console.log(cleaned)

    if (!Object.values(cleaned).some(value => value !== '')) res = 'Please provide at least one item so we can check the stock for you, reply like a seller would, reply in customer language, only vietnamese and english'

    let { brand, name, color, size } = cleaned
    name = brand + ' ' + name
    // console.log(brand, name, color, size)
    const product = await chatbotModel.findProduct(brand, name, color, size)

    // console.log(product)

    if (!product) { res = `product does not exist, consider yourself as a shoes salesperson informing them of the availability of the product they are looking for ${brand}, ${name}, ${color}, ${size}. If you see anything missing brand, name, color, size, ask the customer to fill it in. reply in customer language, only vietnamese and english, short about 3 sentences` }
    else {
      // res = `Here is product info: ${JSON.stringify(product, null, 2)}, here is the element in customer request ${brand}, ${name}, ${color}, ${size}. Product stock notification from product, indicating whether it's in stock or out of stock using the format: product out of stock or in stock. If it's in stock, add a short description, price, size, color to inform the customer — write as naturally as possible, like a seller would, reply in vietnamese, short about 3 sentences`
      res = `Here is old message ${conversation} .Here is product info: ${JSON.stringify(product, null, 2)}, here is customer request ${message}. Product stock notification from product, indicating whether it's in stock or out of stock using the format: product out of stock or in stock. If it's in stock, add a short description, price, size, color to inform the customer — write as naturally as possible, like a shoes seller would, reply in customer language, only vietnamese and english, short about 3 sentences, no use '*'`
    }

  } catch (error) {
    res = 'Please provide at least one item so we can check the stock for you, reply like a seller would, reply in customer language, only vietnamese and english'
  }

  const result = await model.generateContent(res)

  return result.response.text()
  // return res
}

export const chatbotService = {
  chatbot
}