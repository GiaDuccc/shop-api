import { GET_DB } from '~/config/mongodb'// Hàm này bạn phải có để lấy DB connection

const findProduct = async (brand, name, color, size) => {
  // console.log(brand, color, size, name)

  const query = {}

  if (name) query.name = new RegExp(`${name}`, 'i')
  if (brand) query.brand = new RegExp(`^${brand.toLowerCase()}$`, 'i')
  if (color) query['colors.color'] = new RegExp(`^${color.toLowerCase()}$`, 'i')
  if (size) query['colors.sizes.size'] = parseInt(size)

  const result = await GET_DB().collection('products').findOne(query)

  // console.log(result)
  return result
}

export const chatbotModel = {
  findProduct
}