import { PrismaCarsRepository } from '../../repositories/prisma/car'
import { CreateCarUseCase } from '../../usecases/car/create-car.usecase'
import { FindCarUseCase } from '../../usecases/car/find-car.usecase'
import { UpdateCarUseCase } from '../../usecases/car/update-car.usecase'
import { DeleteCarUseCase } from '../../usecases/car/delete-car.usecase'
import { CarsController } from './cars.controller'
import { FindCarsUseCase } from '../../usecases/car/find-cars.usecase'

const repository = new PrismaCarsRepository()
const createCarUseCase = new CreateCarUseCase(repository)
const findCarUseCase = new FindCarUseCase(repository)
const findCarsUseCase = new FindCarsUseCase(repository)
const updateCarUseCase = new UpdateCarUseCase(repository)

const deleteCarUseCase = new DeleteCarUseCase(repository)
const crudCarsController = new CarsController(
  createCarUseCase,
  findCarUseCase,
  findCarsUseCase,
  updateCarUseCase,
  deleteCarUseCase
)

export { crudCarsController }
