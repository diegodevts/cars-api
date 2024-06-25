import { Brand } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { CreateBrandDto } from '../../dtos/brand/create.dto'

export class CreateBrandUseCase implements GenericUseCase<Brand> {
  constructor(
    private genericRepository: GenericRepository<
      Brand,
      CreateBrandDto,
      Partial<Brand>
    >
  ) {}

  async handle(data: CreateBrandDto): Promise<void> {
    await this.genericRepository.create(data)
  }
}
