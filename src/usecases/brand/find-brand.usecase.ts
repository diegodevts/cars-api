import { Brand } from '@prisma/client'
import { GenericRepository } from '../../repositories/generic-repository'
import { GenericUseCase } from '../generic.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { CreateBrandDto } from '../../dtos/brand/create.dto'

export class FindBrandUseCase implements GenericUseCase<Brand> {
  constructor(
    private genericRepository: GenericRepository<
      Brand,
      CreateBrandDto,
      Partial<Brand>
    >
  ) {}

  async handle(field: string, data: string): Promise<Brand> {
    const brand = await this.genericRepository.findBy(field, data)

    if (!brand) {
      throw new ResourceNotFoundError()
    }
    return brand
  }
}
