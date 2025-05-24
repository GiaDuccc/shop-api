import { GET_DB } from '~/config/mongodb'// Hàm này bạn phải có để lấy DB connection

const findProduct = async ({ brand, color, size }) => {

  const result = await GET_DB().collection('products').findOne({
    brand: new RegExp(`^${brand.toLowerCase()}$`, 'i'),
    'colors.sizes.size': parseInt(size),
    'colors.color': new RegExp(`^${color}$`, 'i')
  })

  console.log(result)
  return result
}

export const chatbotModel = {
  findProduct
}