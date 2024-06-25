import { Brand } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { CreateBrandDto } from '../../dtos/brand/create.dto'

export class DeleteBrandUseCase implements GenericUseCase<Brand> {
  constructor(
    private genericRepository: GenericRepository<
      Brand,
      CreateBrandDto,
      Partial<Brand>
    >
  ) {}

  async handle(id: string): Promise<void> {
    await this.genericRepository.delete(id)
  }
}
