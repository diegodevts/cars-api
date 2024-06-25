import { Car } from '@prisma/client'

import { CreateCarDto } from '../../dtos/car/create.dto'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'

export class UpdateCarUseCase implements GenericUseCase<Car> {
  constructor(
    private genericRepository: GenericRepository<
      Car,
      CreateCarDto,
      Partial<Car>
    >
  ) {}

  async handle(data: Partial<Car>, id: string): Promise<Car> {
    const updatedCar = await this.genericRepository.update(data, id)

    if (!updatedCar) {
      throw new ResourceNotFoundError()
    }

    return updatedCar
  }
}
