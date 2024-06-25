import { Brand } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { CreateBrandDto } from '../../dtos/brand/create.dto'

export class UpdateBrandUseCase implements GenericUseCase<Brand> {
  constructor(
    private genericRepository: GenericRepository<
      Brand,
      CreateBrandDto,
      Partial<Brand>
    >
  ) {}

  async handle(data: Partial<Brand>, id: string): Promise<Brand> {
    const updatedBrand = await this.genericRepository.update(data, id)

    if (!updatedBrand) {
      throw new ResourceNotFoundError()
    }

    return updatedBrand
  }
}
