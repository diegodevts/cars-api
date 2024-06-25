import { expect, describe, it, beforeEach } from 'vitest'
import {
  InMemoryGenericRepository,
  id
} from '../../repositories/in-memory/generic-in-memory-repository'
import { Car, FUEL_TYPE } from '@prisma/client'
import { CreateCarUseCase } from './create-car.usecase'
import { randomUUID } from 'crypto'
import { CreateCarDto } from '../../dtos/car/create.dto'
import { FindCarUseCase } from './find-car.usecase'
import { UpdateCarUseCase } from './update-car.usecase'
import { DeleteCarUseCase } from './delete-car.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { FindCarsUseCase } from './find-cars.usecase'
import { PortugueseCar } from '../../dtos/car/portuguese-car.dto'

let carsRepository: InMemoryGenericRepository<
  Car,
  CreateCarDto,
  Partial<CreateCarDto>
>
let createUseCase: CreateCarUseCase
let findUseCase: FindCarUseCase
let findManyUseCase: FindCarsUseCase
let updateUseCase: UpdateCarUseCase
let deleteUseCase: DeleteCarUseCase

describe('Car Usecase', () => {
  beforeEach(async () => {
    carsRepository = new InMemoryGenericRepository()
    createUseCase = new CreateCarUseCase(carsRepository)
    findUseCase = new FindCarUseCase(carsRepository)
    updateUseCase = new UpdateCarUseCase(carsRepository)
    deleteUseCase = new DeleteCarUseCase(carsRepository)
    findManyUseCase = new FindCarsUseCase(carsRepository)

    await createUseCase.handle({
      color: 'black',
      doors: 4,
      fuel_type: FUEL_TYPE.GASOLINE,
      model_id: randomUUID(),
      year: '2020'
    })
  })

  it('should be able to create a car', async () => {
    expect(carsRepository.items.length).toEqual(1)
  })

  it('should be able to get a car by id', async () => {
    const car = await findUseCase.handle('id', id)

    expect(car.id).toEqual(id)
    expect(car.color).toBe('black')
  })

  it('should be able to get all cars', async () => {
    const cars = await findManyUseCase.handle(0, 1)

    expect(cars.length).to.greaterThanOrEqual(1)
  })

  it('should be able to update a car by id', async () => {
    const car = await updateUseCase.handle({ color: 'white' }, id)

    expect(car.id).toEqual(id)
    expect(car.color).toBe('white')
  })

  it('should be able to delete a car by id', async () => {
    await deleteUseCase.handle(id)

    expect(carsRepository.items.length).toEqual(0)
  })

  it('should not be able to get or update a car by wrong id', async () => {
    await expect(() =>
      findUseCase.handle('id', 'non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(() =>
      updateUseCase.handle({ color: 'red' }, 'non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
