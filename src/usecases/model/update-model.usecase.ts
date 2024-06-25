import { Model } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { CreateModelDto } from '../../dtos/model/create.dto'

export class UpdateModelUseCase implements GenericUseCase<Model> {
  constructor(
    private genericRepository: GenericRepository<
      Model,
      CreateModelDto,
      Partial<Model>
    >
  ) {}

  async handle(data: Partial<Model>, id: string): Promise<Model> {
    const updatedModel = await this.genericRepository.update(data, id)

    if (!updatedModel) {
      throw new ResourceNotFoundError()
    }

    return updatedModel
  }
}
