import { expect, describe, it, beforeEach } from 'vitest'
import {
  InMemoryGenericRepository,
  id
} from '../../repositories/in-memory/generic-in-memory-repository'
import { Brand } from '@prisma/client'
import { CreateBrandUseCase } from './create-brand.usecase'
import { FindBrandUseCase } from './find-brand.usecase'
import { UpdateBrandUseCase } from './update-brand.usecase'
import { DeleteBrandUseCase } from './delete-brand.usecase'
import { ResourceNotFoundError } from '../../errors/resource-not-found.error'
import { CreateBrandDto } from '../../dtos/brand/create.dto'
import { FindBrandsUseCase } from './find-brands.usecase'

let brandRepository: InMemoryGenericRepository<
  Brand,
  CreateBrandDto,
  Partial<CreateBrandDto>
>
let createUseCase: CreateBrandUseCase
let findUseCase: FindBrandUseCase
let updateUseCase: UpdateBrandUseCase
let deleteUseCase: DeleteBrandUseCase
let findManyUseCase: FindBrandsUseCase

describe('Car Usecase', () => {
  beforeEach(async () => {
    brandRepository = new InMemoryGenericRepository()
    createUseCase = new CreateBrandUseCase(brandRepository)
    findUseCase = new FindBrandUseCase(brandRepository)
    updateUseCase = new UpdateBrandUseCase(brandRepository)
    deleteUseCase = new DeleteBrandUseCase(brandRepository)
    findManyUseCase = new FindBrandsUseCase(brandRepository)
    await createUseCase.handle({
      name: 'BMW'
    })
  })

  it('should be able to create a car brand', async () => {
    expect(brandRepository.items.length).toEqual(1)
  })

  it('should be able to get a brand by id', async () => {
    const brand = await findUseCase.handle('id', id)

    expect(brand.id).toEqual(id)
    expect(brand.name).toBe('BMW')
  })

  it('should be able to get all brands', async () => {
    const brands = await findManyUseCase.handle(0, 1)

    expect(brands.length).to.greaterThanOrEqual(1)
  })

  it('should be able to update a brand by id', async () => {
    const brand = await updateUseCase.handle({ name: 'BYD' }, id)

    expect(brand.id).toEqual(id)
    expect(brand.name).toBe('BYD')
  })

  it('should be able to delete a brand by id', async () => {
    await deleteUseCase.handle(id)

    expect(brandRepository.items.length).toEqual(0)
  })

  it('should not be able to get or update a brand by wrong id', async () => {
    await expect(() =>
      findUseCase.handle('id', 'non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(() =>
      updateUseCase.handle({ name: 'FIAT' }, 'non-existing-id')
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
