import { Model } from '@prisma/client'
import { prisma } from '../../database/prisma'
import { GenericRepository } from '../generic-repository'
import { CreateModelDto } from '../../dtos/model/create.dto'

export class PrismaModelsRepository
  implements GenericRepository<Model, CreateModelDto, Partial<Model>>
{
  async findBy(field: string, data: string): Promise<Model | null> {
    const model = await prisma.model.findFirst({ where: { [field]: data } })

    return model
  }

  async create(data: CreateModelDto): Promise<void> {
    await prisma.model.create({
      data
    })
  }

  async findAll(skip: number, take: number): Promise<Model[]> {
    const models = await prisma.model.findMany({ skip, take })

    return models
  }

  async update(data: Partial<Model>, id: string): Promise<Model> {
    const model = await prisma.model.update({ where: { id }, data })

    return model
  }

  async delete(id: string): Promise<void> {
    await prisma.model.delete({ where: { id } })
  }
}
