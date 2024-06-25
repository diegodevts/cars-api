import { Router, Request, Response } from 'express'
import { crudCarsController } from '../controllers/car'

const routes = Router()

routes.post('/create', async (request: Request, response: Response) => {
  return await crudCarsController.create(request, response)
})

routes.get('/:id', async (request: Request, response: Response) => {
  return await crudCarsController.find(request, response)
})

routes.get('/', async (request: Request, response: Response) => {
  return await crudCarsController.findAll(request, response)
})

routes.patch('/update/:id', async (request: Request, response: Response) => {
  return await crudCarsController.update(request, response)
})

routes.delete('/delete/:id', async (request: Request, response: Response) => {
  return await crudCarsController.delete(request, response)
})

export default routes
