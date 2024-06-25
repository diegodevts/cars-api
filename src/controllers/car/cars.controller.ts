import { Request, Response } from 'express'

import { z } from 'zod'
import { FUEL_TYPE } from '@prisma/client'
import { CreateCarUseCase } from '../../usecases/car/create-car.usecase'
import { FindCarUseCase } from '../../usecases/car/find-car.usecase'
import { UpdateCarUseCase } from '../../usecases/car/update-car.usecase'
import { DeleteCarUseCase } from '../../usecases/car/delete-car.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'

export class CarsController {
  constructor(
    private createCarUseCase: CreateCarUseCase,
    private findCarUseCase: FindCarUseCase,
    private updateCarUseCase: UpdateCarUseCase,
    private deleteCarUseCase: DeleteCarUseCase
  ) {}

  async create(request: Request, response: Response) {
    const registerBodySchema = z.object({
      color: z.string(),
      doors: z.number(),
      fuel_type: z.enum([
        'GASOLINE',
        'ETHANOL',
        'DIESEL',
        'NATURAL_GAS',
        'LIQUEFIED_PETROLEUM_GAS'
      ]),
      model_id: z.string(),
      year: z.string()
    })

    const { color, doors, fuel_type, model_id, year } =
      registerBodySchema.parse(request.body)

    try {
      await this.createCarUseCase.handle({
        color,
        doors,
        fuel_type: fuel_type as FUEL_TYPE,
        model_id,
        year
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
      const car = await this.findCarUseCase.handle('id', id)

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

  async update(request: Request, response: Response) {
    const registerBodySchema = z.object({
      color: z.optional(z.string()),
      doors: z.optional(z.number()),
      fuel_type: z.optional(
        z.enum([
          'GASOLINE',
          'ETHANOL',
          'DIESEL',
          'NATURAL_GAS',
          'LIQUEFIED_PETROLEUM_GAS'
        ])
      ),
      model_id: z.optional(z.string()),
      year: z.optional(z.string())
    })
    const registerParamsSchema = z.object({ id: z.string() })

    const data = registerBodySchema.parse(request.body)

    const { id } = registerParamsSchema.parse(request.params)

    try {
      const car = await this.updateCarUseCase.handle(data, id)

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
      await this.deleteCarUseCase.handle(id)

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
