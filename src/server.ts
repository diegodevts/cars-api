import express, { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import os from 'os'
import { env } from '../env'
const app = express()
const PORT = env.PORT
import cors from 'cors'
import routes from './routes'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((request: Request, response: Response, next: NextFunction) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', '*')
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')

  app.use(cors())

  next()
})

app.get('/', (request: Request, response: Response) => {
  response.json({ message: 'Welcome to Car API v1.0', instance: os.hostname() })
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is on [http://localhost:${PORT}]`)
})
