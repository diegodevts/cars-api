import { Model } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { CreateModelDto } from '../../dtos/model/create.dto'

export class DeleteModelUseCase implements GenericUseCase<Model> {
  constructor(
    private genericRepository: GenericRepository<
      Model,
      CreateModelDto,
      Partial<Model>
    >
  ) {}

  async handle(id: string): Promise<void> {
    await this.genericRepository.delete(id)
  }
}
