import { Router, Request, Response } from 'express'
import { crudModelsController } from '../controllers/model'

const routes = Router()

routes.post('/create', async (request: Request, response: Response) => {
  return await crudModelsController.create(request, response)
})

routes.get('/:id', async (request: Request, response: Response) => {
  return await crudModelsController.find(request, response)
})

routes.get('/', async (request: Request, response: Response) => {
  return await crudModelsController.findAll(request, response)
})

routes.patch('/update/:id', async (request: Request, response: Response) => {
  return await crudModelsController.update(request, response)
})

routes.delete('/delete/:id', async (request: Request, response: Response) => {
  return await crudModelsController.delete(request, response)
})

export default routes
