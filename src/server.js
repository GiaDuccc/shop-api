/* eslint-disable no-console */
import express from 'express'
import { env } from '~/config/environment.js'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb'
import { APIs_v1 } from './routes/v1'
import cors from 'cors'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import path from 'path'


const START_SERVER = () => {
  const app = express()

  app.use(express.urlencoded({ extended: true }))

  // Enable req.body json data
  app.use(express.json())

  // Xử lí CORS
  app.use(cors(corsOptions))

  app.use('/v1', APIs_v1)

  app.use(errorHandlingMiddleware)

  app.use('/allProduct', express.static(path.join(__dirname, '../allProduct')))

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log('env.BUILD_MODE:', process.env.BUILD_MODE)
      console.log(`Hello ${env.AUTHOR}, I am running at ${process.env.PORT}`)
    })
  } else {
    // Dev enviroment
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log('env.BUILD_MODE:', process.env.BUILD_MODE)
      console.log(`Hello Gia Duc, I am running at http://${env.APP_HOST}:${env.APP_PORT}`)
    })
  }

  exitHook(() => {
    console.log('server is shutting down')
    CLOSE_DB()
    console.log('disconencted')
  })
}

(async () => {
  try {
    console.log('connecting to cloud atlas')
    await CONNECT_DB()
    console.log('connected to cloud atlas')
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()
