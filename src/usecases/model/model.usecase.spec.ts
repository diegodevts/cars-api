import { expect, describe, it, beforeEach } from 'vitest'
import {
  InMemoryGenericRepository,
  id
} from '../../repositories/in-memory/generic-in-memory-repository'
import { Model } from '@prisma/client'
import { CreateModelUseCase } from './create-model.usecase'
import { FindModelUseCase } from './find-model.usecase'
import { UpdateModelUseCase } from './update-model.usecase'
import { DeleteModelUseCase } from './delete-model.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { CreateModelDto } from '../../dtos/model/create.dto'
import { randomUUID } from 'crypto'
import { FindModelsUseCase } from './find-models.usecase'

let modelRepository: InMemoryGenericRepository<
  Model,
  CreateModelDto,
  Partial<CreateModelDto>
>
let createUseCase: CreateModelUseCase
let findUseCase: FindModelUseCase
let findManyUseCase: FindModelsUseCase
let updateUseCase: UpdateModelUseCase
let deleteUseCase: DeleteModelUseCase

describe('Car Usecase', () => {
  beforeEach(async () => {
    modelRepository = new InMemoryGenericRepository()
    createUseCase = new CreateModelUseCase(modelRepository)
    findUseCase = new FindModelUseCase(modelRepository)
    findManyUseCase = new FindModelsUseCase(modelRepository)
    updateUseCase = new UpdateModelUseCase(modelRepository)
    deleteUseCase = new DeleteModelUseCase(modelRepository)

    await createUseCase.handle({
      name: 'Uno',
      fipe: 25.35,
      brand_id: randomUUID()
    })
  })

  it('should be able to create a car model', async () => {
    expect(modelRepository.items.length).toEqual(1)
  })

  it('should be able to get a model by id', async () => {
    const model = await findUseCase.handle('id', id)

    expect(model.id).toEqual(id)
    expect(model.name).toBe('Uno')
  })

  it('should be able to get all models', async () => {
    const models = await findManyUseCase.handle(0, 1)

    expect(models.length).to.greaterThanOrEqual(1)
  })

  it('should be able to update a model by id', async () => {
    const model = await updateUseCase.handle({ name: 'Siena' }, id)

    expect(model.id).toEqual(id)
    expect(model.name).toBe('Siena')
  })

  it('should be able to delete a model by id', async () => {
    await deleteUseCase.handle(id)

    expect(modelRepository.items.length).toEqual(0)
  })

  it('should not be able to get or update a model by wrong id', async () => {
    await expect(() =>
      findUseCase.handle('id', 'non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(() =>
      updateUseCase.handle({ name: 'FIAT' }, 'non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
