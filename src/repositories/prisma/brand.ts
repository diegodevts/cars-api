import { Brand, Car } from '@prisma/client'
import { prisma } from '../../database/prisma'
import { GenericRepository } from '../generic-repository'
import { CreateBrandDto } from '../../dtos/brand/create.dto'

export class PrismaBrandsRepository
  implements GenericRepository<Brand, CreateBrandDto, Partial<Brand>>
{
  async findBy(field: string, data: string): Promise<Brand | null> {
    const brand = await prisma.brand.findFirst({ where: { [field]: data } })

    return brand
  }

  async create(data: CreateBrandDto): Promise<void> {
    await prisma.brand.create({
      data
    })
  }

  async findAll(skip: number, take: number): Promise<Brand[]> {
    const brands = await prisma.brand.findMany({ skip, take })

    return brands
  }

  async update(data: Partial<Brand>, id: string): Promise<Brand> {
    const brand = await prisma.brand.update({ where: { id }, data })

    return brand
  }

  async delete(id: string): Promise<void> {
    await prisma.brand.delete({ where: { id } })
  }
}
