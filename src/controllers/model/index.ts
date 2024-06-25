import { PrismaModelsRepository } from '../../repositories/prisma/model'
import { CreateModelUseCase } from '../../usecases/model/create-model.usecase'
import { FindModelUseCase } from '../../usecases/model/find-model.usecase'
import { UpdateModelUseCase } from '../../usecases/model/update-model.usecase'
import { DeleteModelUseCase } from '../../usecases/model/delete-model.usecase'
import { ModelsController } from './models.controller'
import { FindModelsUseCase } from '../../usecases/model/find-models.usecase'

const repository = new PrismaModelsRepository()
const createModelUseCase = new CreateModelUseCase(repository)
const findModelUseCase = new FindModelUseCase(repository)
const findModelsUseCase = new FindModelsUseCase(repository)
const updateModelUseCase = new UpdateModelUseCase(repository)

const deleteModelUseCase = new DeleteModelUseCase(repository)
const crudModelsController = new ModelsController(
  createModelUseCase,
  findModelUseCase,
  findModelsUseCase,
  updateModelUseCase,
  deleteModelUseCase
)

export { crudModelsController }
