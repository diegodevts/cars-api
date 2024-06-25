import { Model } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { CreateModelDto } from '../../dtos/model/create.dto'

export class FindModelsUseCase implements GenericUseCase<Model[]> {
  constructor(
    private genericRepository: GenericRepository<
      Model,
      CreateModelDto,
      Partial<Model>
    >
  ) {}

  async handle(skip: number, take: number): Promise<Model[]> {
    const models = await this.genericRepository.findAll(skip, take)

    return models
  }
}
