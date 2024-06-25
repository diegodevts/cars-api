import { Router, Request, Response } from 'express'
import { crudBrandsController } from '../controllers/brand'

const routes = Router()

routes.post('/create', async (request: Request, response: Response) => {
  return await crudBrandsController.create(request, response)
})

routes.get('/:id', async (request: Request, response: Response) => {
  return await crudBrandsController.find(request, response)
})

routes.patch('/update/:id', async (request: Request, response: Response) => {
  return await crudBrandsController.update(request, response)
})

routes.delete('/delete/:id', async (request: Request, response: Response) => {
  return await crudBrandsController.delete(request, response)
})

export default routes
