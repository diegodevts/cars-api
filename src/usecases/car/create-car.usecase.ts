import { Car } from '@prisma/client'

import { CreateCarDto } from '../../dtos/car/create.dto'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'

export class CreateCarUseCase implements GenericUseCase<Car> {
  constructor(
    private genericRepository: GenericRepository<
      Car,
      CreateCarDto,
      Partial<Car>
    >
  ) {}

  async handle(data: CreateCarDto): Promise<void> {
    await this.genericRepository.create(data)
  }
}
