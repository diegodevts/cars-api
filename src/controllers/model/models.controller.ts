import { Request, Response } from 'express'

import { z } from 'zod'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { CreateModelUseCase } from '../../usecases/model/create-model.usecase'
import { FindModelUseCase } from '../../usecases/model/find-model.usecase'
import { UpdateModelUseCase } from '../../usecases/model/update-model.usecase'
import { DeleteModelUseCase } from '../../usecases/model/delete-model.usecase'

export class ModelsController {
  constructor(
    private createModelUseCase: CreateModelUseCase,
    private findModelUseCase: FindModelUseCase,
    private updateModelUseCase: UpdateModelUseCase,
    private deleteModelUseCase: DeleteModelUseCase
  ) {}

  async create(request: Request, response: Response) {
    const registerBodySchema = z.object({
      name: z.string(),
      fipe: z.number(),
      brand_id: z.string()
    })

    const { name, fipe, brand_id } = registerBodySchema.parse(request.body)

    try {
      await this.createModelUseCase.handle({
        name,
        fipe,
        brand_id
      })

      return response.status(201).send({
        message: 'Succesfuly created!',
        code: 201
      })
    } catch (err: any) {
      return response
        .status(409)
        .send({ message: err.message ?? 'Conflict', code: 409 })
    }
  }

  async find(request: Request, response: Response) {
    const registerParamsSchema = z.object({ id: z.string() })

    const { id } = registerParamsSchema.parse(request.params)

    try {
      const model = await this.findModelUseCase.handle('id', id)

      return response.status(200).send({ message: 'Ok!', code: 200, model })
    } catch (err: any) {
      if (err instanceof ResourceNotFoundError) {
        return response.status(404).send({ message: err.message, code: 404 })
      }

      return response
        .status(500)
        .send({ message: 'internal Server Error', code: 500 })
    }
  }

  async update(request: Request, response: Response) {
    const registerBodySchema = z.object({
      name: z.optional(z.string()),
      fipe: z.optional(z.number())
    })
    const registerParamsSchema = z.object({ id: z.string() })

    const data = registerBodySchema.parse(request.body)

    const { id } = registerParamsSchema.parse(request.params)

    try {
      const model = await this.updateModelUseCase.handle(data, id)

      return response.status(201).send({
        message: 'Succesfuly updated!',
        code: 201,
        model
      })
    } catch (err: any) {
      if (err instanceof ResourceNotFoundError) {
        return response.status(404).send({ message: err.message, code: 404 })
      }

      return response
        .status(500)
        .send({ message: 'Internal Server Error', code: 500 })
    }
  }

  async delete(request: Request, response: Response) {
    const registerParamsSchema = z.object({ id: z.string() })

    const { id } = registerParamsSchema.parse(request.params)

    try {
      await this.deleteModelUseCase.handle(id)

      return response
        .status(200)
        .send({ message: 'Succesfully deleted!', code: 200 })
    } catch (err: any) {
      return response
        .status(500)
        .send({ message: 'internal Server Error', code: 500 })
    }
  }
}
