import express from 'express'
import { env } from '~/config/environment.js'

const START_SERVER = () => {
  const app = express()

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello Gia Duc, I am running at http://${ env.APP_HOST }:${ env.APP_PORT }`)
  })
}

START_SERVER()