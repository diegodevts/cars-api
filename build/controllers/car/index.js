var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/car/index.ts
var car_exports = {};
__export(car_exports, {
  crudCarsController: () => crudCarsController
});
module.exports = __toCommonJS(car_exports);

// env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod.z.coerce.number().default(3e3),
  DATABASE_URL: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u274C Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : [],
  errorFormat: "minimal"
});

// src/repositories/prisma/car.ts
var PrismaCarsRepository = class {
  async findBy(field, data) {
    const car = await prisma.car.findFirst({ where: { [field]: data } });
    return car;
  }
  async create(data) {
    await prisma.car.create({
      data
    });
  }
  async findAll(skip, take) {
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
    });
    return cars;
  }
  async update(data, id) {
    const car = await prisma.car.update({ where: { id }, data });
    return car;
  }
  async delete(id) {
    await prisma.car.delete({ where: { id } });
  }
};

// src/usecases/car/create-car.usecase.ts
var CreateCarUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(data) {
    await this.genericRepository.create(data);
  }
};

// src/errors/resource-not-found.error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/usecases/car/find-car.usecase.ts
var FindCarUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(field, data) {
    const car = await this.genericRepository.findBy(field, data);
    if (!car) {
      throw new ResourceNotFoundError();
    }
    return car;
  }
};

// src/usecases/car/update-car.usecase.ts
var UpdateCarUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(data, id) {
    const updatedCar = await this.genericRepository.update(data, id);
    if (!updatedCar) {
      throw new ResourceNotFoundError();
    }
    return updatedCar;
  }
};

// src/usecases/car/delete-car.usecase.ts
var DeleteCarUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(id) {
    await this.genericRepository.delete(id);
  }
};

// src/controllers/car/cars.controller.ts
var import_zod2 = require("zod");

// src/helpers/json.ts
var json = (param) => {
  return JSON.parse(
    JSON.stringify(
      param,
      (key, value) => typeof value === "bigint" ? value.toString() : value
      // return everything else unchanged
    )
  );
};
var json_default = json;

// src/controllers/car/cars.controller.ts
var CarsController = class {
  constructor(createCarUseCase2, findCarUseCase2, findCarsUseCase2, updateCarUseCase2, deleteCarUseCase2) {
    this.createCarUseCase = createCarUseCase2;
    this.findCarUseCase = findCarUseCase2;
    this.findCarsUseCase = findCarsUseCase2;
    this.updateCarUseCase = updateCarUseCase2;
    this.deleteCarUseCase = deleteCarUseCase2;
  }
  async create(request, response) {
    const registerBodySchema = import_zod2.z.object({
      color: import_zod2.z.string(),
      doors: import_zod2.z.number(),
      fuel_type: import_zod2.z.enum([
        "GASOLINE",
        "ETHANOL",
        "DIESEL",
        "NATURAL_GAS",
        "LIQUEFIED_PETROLEUM_GAS"
      ]),
      model_id: import_zod2.z.string(),
      year: import_zod2.z.string()
    });
    const { color, doors, fuel_type, model_id, year } = registerBodySchema.parse(request.body);
    try {
      await this.createCarUseCase.handle({
        color,
        doors,
        fuel_type,
        model_id,
        year
      });
      return response.status(201).send({
        message: "Succesfuly created!",
        code: 201
      });
    } catch (err) {
      return response.status(409).send({ message: err.message ?? "Conflict", code: 409 });
    }
  }
  async find(request, response) {
    const registerParamsSchema = import_zod2.z.object({ id: import_zod2.z.string() });
    const { id } = registerParamsSchema.parse(request.params);
    try {
      const car = await this.findCarUseCase.handle("id", id);
      return response.status(200).send({ message: "Ok!", code: 200, car });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return response.status(404).send({ message: err.message, code: 404 });
      }
      return response.status(500).send({ message: "internal Server Error", code: 500 });
    }
  }
  async findAll(request, response) {
    const registerParamsSchema = import_zod2.z.object({
      skip: import_zod2.z.optional(import_zod2.z.string()),
      take: import_zod2.z.optional(import_zod2.z.string())
    });
    const { skip, take } = registerParamsSchema.parse(request.query);
    try {
      const cars = await this.findCarsUseCase.handle(+skip, +take);
      return response.status(200).send({ message: "Ok!", code: 200, cars: json_default(cars) });
    } catch (err) {
      return response.status(500).send({ message: "internal Server Error", code: 500 });
    }
  }
  async update(request, response) {
    const registerBodySchema = import_zod2.z.object({
      color: import_zod2.z.optional(import_zod2.z.string()),
      doors: import_zod2.z.optional(import_zod2.z.number()),
      fuel_type: import_zod2.z.optional(
        import_zod2.z.enum([
          "GASOLINE",
          "ETHANOL",
          "DIESEL",
          "NATURAL_GAS",
          "LIQUEFIED_PETROLEUM_GAS"
        ])
      ),
      model_id: import_zod2.z.optional(import_zod2.z.string()),
      year: import_zod2.z.optional(import_zod2.z.string())
    });
    const registerParamsSchema = import_zod2.z.object({ id: import_zod2.z.string() });
    const data = registerBodySchema.parse(request.body);
    const { id } = registerParamsSchema.parse(request.params);
    try {
      const car = await this.updateCarUseCase.handle(data, id);
      return response.status(201).send({
        message: "Succesfuly updated!",
        code: 201,
        car
      });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return response.status(404).send({ message: err.message, code: 404 });
      }
      return response.status(500).send({ message: "Internal Server Error", code: 500 });
    }
  }
  async delete(request, response) {
    const registerParamsSchema = import_zod2.z.object({ id: import_zod2.z.string() });
    const { id } = registerParamsSchema.parse(request.params);
    try {
      await this.deleteCarUseCase.handle(id);
      return response.status(200).send({ message: "Succesfully deleted!", code: 200 });
    } catch (err) {
      return response.status(500).send({ message: "internal Server Error", code: 500 });
    }
  }
};

// src/usecases/car/find-cars.usecase.ts
var FindCarsUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(skip, take) {
    const cars = await this.genericRepository.findAll(skip, take);
    return cars;
  }
};

// src/controllers/car/index.ts
var repository = new PrismaCarsRepository();
var createCarUseCase = new CreateCarUseCase(repository);
var findCarUseCase = new FindCarUseCase(repository);
var findCarsUseCase = new FindCarsUseCase(repository);
var updateCarUseCase = new UpdateCarUseCase(repository);
var deleteCarUseCase = new DeleteCarUseCase(repository);
var crudCarsController = new CarsController(
  createCarUseCase,
  findCarUseCase,
  findCarsUseCase,
  updateCarUseCase,
  deleteCarUseCase
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  crudCarsController
});
