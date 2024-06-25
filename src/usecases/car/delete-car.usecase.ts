import { Car } from '@prisma/client'

import { CreateCarDto } from '../../dtos/car/create.dto'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { PortugueseCar } from '../../dtos/car/portuguese-car.dto'

export class DeleteCarUseCase implements GenericUseCase<Car> {
  constructor(
    private genericRepository: GenericRepository<
      Car,
      CreateCarDto,
      Partial<Car>
    >
  ) {}

  async handle(id: string): Promise<void> {
    await this.genericRepository.delete(id)
  }
}
