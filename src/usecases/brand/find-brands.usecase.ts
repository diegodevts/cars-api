import { Brand } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { CreateBrandDto } from '../../dtos/brand/create.dto'

export class FindBrandsUseCase implements GenericUseCase<Brand[]> {
  constructor(
    private genericRepository: GenericRepository<
      Brand,
      CreateBrandDto,
      Partial<Brand>
    >
  ) {}

  async handle(skip: number, take: number): Promise<Brand[]> {
    const brands = await this.genericRepository.findAll(skip, take)

    return brands
  }
}
