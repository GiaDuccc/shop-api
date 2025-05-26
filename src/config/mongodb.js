/* eslint-disable no-console */
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

let shopDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {

  // Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance;
  await mongoClientInstance.connect()

  // Kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào biến
  // trelloDatabaseInstance ở trên
  shopDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
  console.log(`ket noi thành công db ${env.DATABASE_NAME}`)
}

// Đóng kết nối tới database khi cần
export const CLOSE_DB = async () => {
  console.log('đóng db')
  await mongoClientInstance.close()
}

export const GET_DB = () => {
  if (!shopDatabaseInstance) throw new Error ('Must connect to Database first!')
  return shopDatabaseInstance
}
