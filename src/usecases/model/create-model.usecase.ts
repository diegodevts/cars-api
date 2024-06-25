import { Model } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { CreateModelDto } from '../../dtos/model/create.dto'

export class CreateModelUseCase implements GenericUseCase<Model> {
  constructor(
    private genericRepository: GenericRepository<
      Model,
      CreateModelDto,
      Partial<Model>
    >
  ) {}

  async handle(data: CreateModelDto): Promise<void> {
    await this.genericRepository.create(data)
  }
}
