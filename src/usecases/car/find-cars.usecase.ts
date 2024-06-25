import { $Enums, Car } from '@prisma/client'

import { CreateCarDto } from '../../dtos/car/create.dto'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'

export class FindCarsUseCase implements GenericUseCase<Car[]> {
  constructor(
    private genericRepository: GenericRepository<
      Car,
      CreateCarDto,
      Partial<Car>
    >
  ) {}

  async handle(skip: number, take: number): Promise<Car[]> {
    const cars = await this.genericRepository.findAll(skip, take)

    return cars
  }
}
