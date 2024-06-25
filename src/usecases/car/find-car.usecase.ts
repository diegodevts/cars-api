import { Car } from '@prisma/client'

import { CreateCarDto } from '../../dtos/car/create.dto'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { PortugueseCar } from '../../dtos/car/portuguese-car.dto'

export class FindCarUseCase implements GenericUseCase<Car> {
  constructor(
    private genericRepository: GenericRepository<
      Car,
      CreateCarDto,
      Partial<Car>
    >
  ) {}

  async handle(field: string, data: string): Promise<Car> {
    const car = await this.genericRepository.findBy(field, data)

    if (!car) {
      throw new ResourceNotFoundError()
    }
    return car
  }
}
