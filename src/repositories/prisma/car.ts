import { $Enums, Car } from '@prisma/client'
import { prisma } from '../../database/prisma'
import { GenericRepository } from '../generic-repository'
import { CreateCarDto } from '../../dtos/car/create.dto'
import { PortugueseCar } from '../../dtos/car/portuguese-car.dto'

export class PrismaCarsRepository
  implements GenericRepository<Car, CreateCarDto, Partial<Car>>
{
  async findBy(field: string, data: string): Promise<Car | null> {
    const car = await prisma.car.findFirst({ where: { [field]: data } })

    return car
  }

  async create(data: CreateCarDto): Promise<void> {
    await prisma.car.create({
      data
    })
  }

  async findAll(skip: number, take: number): Promise<Car[]> {
    const cars = await prisma.car.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      select: {
        id: true,
        timestamp: true,
        model_id: true,
        year: true,
        fuel_type: true,
        doors: true,
        color: true,
        model: { select: { name: true, fipe: true } }
      }
    })

    return cars
  }

  async update(data: Partial<Car>, id: string): Promise<Car> {
    const car = await prisma.car.update({ where: { id }, data })

    return car
  }

  async delete(id: string): Promise<void> {
    await prisma.car.delete({ where: { id } })
  }
}
