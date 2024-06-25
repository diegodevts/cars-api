import { BrandsController } from './brands.controller'
import { PrismaBrandsRepository } from '../../repositories/prisma/brand'
import { CreateBrandUseCase } from '../../usecases/brand/create-brand.usecase'
import { FindBrandUseCase } from '../../usecases/brand/find-brand.usecase'
import { UpdateBrandUseCase } from '../../usecases/brand/update-brand.usecase'
import { DeleteBrandUseCase } from '../../usecases/brand/delete-brand.usecase'
import { FindBrandsUseCase } from '../../usecases/brand/find-brands.usecase'

const repository = new PrismaBrandsRepository()
const createBrandUseCase = new CreateBrandUseCase(repository)
const findBrandUseCase = new FindBrandUseCase(repository)
const findBrandsUseCase = new FindBrandsUseCase(repository)
const updateBrandUseCase = new UpdateBrandUseCase(repository)

const deleteBrandUseCase = new DeleteBrandUseCase(repository)
const crudBrandsController = new BrandsController(
  createBrandUseCase,
  findBrandUseCase,
  findBrandsUseCase,
  updateBrandUseCase,
  deleteBrandUseCase
)

export { crudBrandsController }
