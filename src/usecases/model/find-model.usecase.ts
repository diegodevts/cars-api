import { Model } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { CreateModelDto } from '../../dtos/model/create.dto'

export class FindModelUseCase implements GenericUseCase<Model> {
  constructor(
    private genericRepository: GenericRepository<
      Model,
      CreateModelDto,
      Partial<Model>
    >
  ) {}

  async handle(field: string, data: string): Promise<Model> {
    const model = await this.genericRepository.findBy(field, data)

    if (!model) {
      throw new ResourceNotFoundError()
    }
    return model
  }
}
