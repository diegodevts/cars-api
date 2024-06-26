import { Request, Response } from 'express'

import { z } from 'zod'
import { Car, FUEL_TYPE } from '@prisma/client'
import { CreateCarUseCase } from '../../usecases/car/create-car.usecase'
import { FindCarUseCase } from '../../usecases/car/find-car.usecase'
import { UpdateCarUseCase } from '../../usecases/car/update-car.usecase'
import { DeleteCarUseCase } from '../../usecases/car/delete-car.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { FindCarsUseCase } from '../../usecases/car/find-cars.usecase'
import json from '../../helpers/json'

export class CarsController {
  constructor(
    private createCarUseCase: CreateCarUseCase,
    private findCarUseCase: FindCarUseCase,
    private findCarsUseCase: FindCarsUseCase,
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

      return response
        .status(200)
        .send({ message: 'Ok!', code: 200, car: json(car) })
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
      const cars = await this.findCarsUseCase.handle(+skip, +take)

      return response
        .status(200)
        .send({ message: 'Ok!', code: 200, cars: json(cars) })
    } catch (err: any) {
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
        car: json(car)
      })
    } catch (err: any) {
      console.log(err)
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
