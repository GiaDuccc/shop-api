/* eslint-disable no-console */
import express from 'express'
import { env } from '~/config/environment.js'
import exitHook from 'async-exit-hook'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb'
import { APIs_v1 } from './routes/v1'

const START_SERVER = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())

  app.get('/', (req, res) => {
    res.send('<h1>Hello World 1</h1>')
  })

  app.use('/v1', APIs_v1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello Gia Duc, I am running at http://${ env.APP_HOST }:${ env.APP_PORT }`)
  })

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
