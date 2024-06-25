import { Request, Response } from 'express'

import { z } from 'zod'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { CreateBrandUseCase } from '../../usecases/brand/create-brand.usecase'
import { FindBrandUseCase } from '../../usecases/brand/find-brand.usecase'
import { UpdateBrandUseCase } from '../../usecases/brand/update-brand.usecase'
import { DeleteBrandUseCase } from '../../usecases/brand/delete-brand.usecase'
import { FindBrandsUseCase } from '../../usecases/brand/find-brands.usecase'

export class BrandsController {
  constructor(
    private createBrandUseCase: CreateBrandUseCase,
    private findBrandUseCase: FindBrandUseCase,
    private findBrandsUseCase: FindBrandsUseCase,
    private updateBrandUseCase: UpdateBrandUseCase,
    private deleteBrandUseCase: DeleteBrandUseCase
  ) {}

  async create(request: Request, response: Response) {
    const registerBodySchema = z.object({
      name: z.string()
    })

    const { name } = registerBodySchema.parse(request.body)

    try {
      await this.createBrandUseCase.handle({
        name
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
      const car = await this.findBrandUseCase.handle('id', id)

      return response.status(200).send({ message: 'Ok!', code: 200, car })
    } catch (err: any) {
      if (err instanceof ResourceNotFoundError) {
        return response.status(404).send({ message: err.message, code: 404 })
      }

      return response
        .status(500)
        .send({ message: 'internal Server Error', code: 500 })
    }
  }

  async findAll(request: Request, response: Response) {
    const registerParamsSchema = z.object({
      skip: z.optional(z.string()),
      take: z.optional(z.string())
    })

    const { skip, take } = registerParamsSchema.parse(request.query)

    try {
      const brands = await this.findBrandsUseCase.handle(+skip, +take)

      return response.status(200).send({ message: 'Ok!', code: 200, brands })
    } catch (err: any) {
      return response
        .status(500)
        .send({ message: 'internal Server Error', code: 500 })
    }
  }

  async update(request: Request, response: Response) {
    const registerBodySchema = z.object({
      name: z.optional(z.string())
    })
    const registerParamsSchema = z.object({ id: z.string() })

    const data = registerBodySchema.parse(request.body)

    const { id } = registerParamsSchema.parse(request.params)

    try {
      const car = await this.updateBrandUseCase.handle(data, id)

      return response.status(201).send({
        message: 'Succesfuly updated!',
        code: 201,
        car
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
      await this.deleteBrandUseCase.handle(id)

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
