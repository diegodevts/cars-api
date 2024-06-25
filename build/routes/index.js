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

// src/routes/index.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express4 = require("express");

// src/routes/car.routes.ts
var import_express = require("express");

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

// src/routes/car.routes.ts
var routes = (0, import_express.Router)();
routes.post("/create", async (request, response) => {
  return await crudCarsController.create(request, response);
});
routes.get("/:id", async (request, response) => {
  return await crudCarsController.find(request, response);
});
routes.get("/all", async (request, response) => {
  return await crudCarsController.findAll(request, response);
});
routes.patch("/update/:id", async (request, response) => {
  return await crudCarsController.update(request, response);
});
routes.delete("/delete/:id", async (request, response) => {
  return await crudCarsController.delete(request, response);
});
var car_routes_default = routes;

// src/routes/brand.routes.ts
var import_express2 = require("express");

// src/controllers/brand/brands.controller.ts
var import_zod3 = require("zod");
var BrandsController = class {
  constructor(createBrandUseCase2, findBrandUseCase2, updateBrandUseCase2, deleteBrandUseCase2) {
    this.createBrandUseCase = createBrandUseCase2;
    this.findBrandUseCase = findBrandUseCase2;
    this.updateBrandUseCase = updateBrandUseCase2;
    this.deleteBrandUseCase = deleteBrandUseCase2;
  }
  async create(request, response) {
    const registerBodySchema = import_zod3.z.object({
      name: import_zod3.z.string()
    });
    const { name } = registerBodySchema.parse(request.body);
    try {
      await this.createBrandUseCase.handle({
        name
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
    const registerParamsSchema = import_zod3.z.object({ id: import_zod3.z.string() });
    const { id } = registerParamsSchema.parse(request.params);
    try {
      const car = await this.findBrandUseCase.handle("id", id);
      return response.status(200).send({ message: "Ok!", code: 200, car });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return response.status(404).send({ message: err.message, code: 404 });
      }
      return response.status(500).send({ message: "internal Server Error", code: 500 });
    }
  }
  async update(request, response) {
    const registerBodySchema = import_zod3.z.object({
      name: import_zod3.z.optional(import_zod3.z.string())
    });
    const registerParamsSchema = import_zod3.z.object({ id: import_zod3.z.string() });
    const data = registerBodySchema.parse(request.body);
    const { id } = registerParamsSchema.parse(request.params);
    try {
      const car = await this.updateBrandUseCase.handle(data, id);
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
    const registerParamsSchema = import_zod3.z.object({ id: import_zod3.z.string() });
    const { id } = registerParamsSchema.parse(request.params);
    try {
      await this.deleteBrandUseCase.handle(id);
      return response.status(200).send({ message: "Succesfully deleted!", code: 200 });
    } catch (err) {
      return response.status(500).send({ message: "internal Server Error", code: 500 });
    }
  }
};

// src/repositories/prisma/brand.ts
var PrismaBrandsRepository = class {
  async findBy(field, data) {
    const brand = await prisma.brand.findFirst({ where: { [field]: data } });
    return brand;
  }
  async create(data) {
    await prisma.brand.create({
      data
    });
  }
  async findAll(skip, take) {
    const brands = await prisma.brand.findMany({ skip, take });
    return brands;
  }
  async update(data, id) {
    const brand = await prisma.brand.update({ where: { id }, data });
    return brand;
  }
  async delete(id) {
    await prisma.brand.delete({ where: { id } });
  }
};

// src/usecases/brand/create-brand.usecase.ts
var CreateBrandUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(data) {
    await this.genericRepository.create(data);
  }
};

// src/usecases/brand/find-brand.usecase.ts
var FindBrandUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(field, data) {
    const brand = await this.genericRepository.findBy(field, data);
    if (!brand) {
      throw new ResourceNotFoundError();
    }
    return brand;
  }
};

// src/usecases/brand/update-brand.usecase.ts
var UpdateBrandUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(data, id) {
    const updatedBrand = await this.genericRepository.update(data, id);
    if (!updatedBrand) {
      throw new ResourceNotFoundError();
    }
    return updatedBrand;
  }
};

// src/usecases/brand/delete-brand.usecase.ts
var DeleteBrandUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(id) {
    await this.genericRepository.delete(id);
  }
};

// src/controllers/brand/index.ts
var repository2 = new PrismaBrandsRepository();
var createBrandUseCase = new CreateBrandUseCase(repository2);
var findBrandUseCase = new FindBrandUseCase(repository2);
var updateBrandUseCase = new UpdateBrandUseCase(repository2);
var deleteBrandUseCase = new DeleteBrandUseCase(repository2);
var crudBrandsController = new BrandsController(
  createBrandUseCase,
  findBrandUseCase,
  updateBrandUseCase,
  deleteBrandUseCase
);

// src/routes/brand.routes.ts
var routes2 = (0, import_express2.Router)();
routes2.post("/create", async (request, response) => {
  return await crudBrandsController.create(request, response);
});
routes2.get("/:id", async (request, response) => {
  return await crudBrandsController.find(request, response);
});
routes2.patch("/update/:id", async (request, response) => {
  return await crudBrandsController.update(request, response);
});
routes2.delete("/delete/:id", async (request, response) => {
  return await crudBrandsController.delete(request, response);
});
var brand_routes_default = routes2;

// src/routes/model.routes.ts
var import_express3 = require("express");

// src/repositories/prisma/model.ts
var PrismaModelsRepository = class {
  async findBy(field, data) {
    const model = await prisma.model.findFirst({ where: { [field]: data } });
    return model;
  }
  async create(data) {
    await prisma.model.create({
      data
    });
  }
  async findAll(skip, take) {
    const models = await prisma.model.findMany({ skip, take });
    return models;
  }
  async update(data, id) {
    const model = await prisma.model.update({ where: { id }, data });
    return model;
  }
  async delete(id) {
    await prisma.model.delete({ where: { id } });
  }
};

// src/usecases/model/create-model.usecase.ts
var CreateModelUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(data) {
    await this.genericRepository.create(data);
  }
};

// src/usecases/model/find-model.usecase.ts
var FindModelUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(field, data) {
    const model = await this.genericRepository.findBy(field, data);
    if (!model) {
      throw new ResourceNotFoundError();
    }
    return model;
  }
};

// src/usecases/model/update-model.usecase.ts
var UpdateModelUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(data, id) {
    const updatedModel = await this.genericRepository.update(data, id);
    if (!updatedModel) {
      throw new ResourceNotFoundError();
    }
    return updatedModel;
  }
};

// src/usecases/model/delete-model.usecase.ts
var DeleteModelUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(id) {
    await this.genericRepository.delete(id);
  }
};

// src/controllers/model/models.controller.ts
var import_zod4 = require("zod");
var ModelsController = class {
  constructor(createModelUseCase2, findModelUseCase2, updateModelUseCase2, deleteModelUseCase2) {
    this.createModelUseCase = createModelUseCase2;
    this.findModelUseCase = findModelUseCase2;
    this.updateModelUseCase = updateModelUseCase2;
    this.deleteModelUseCase = deleteModelUseCase2;
  }
  async create(request, response) {
    const registerBodySchema = import_zod4.z.object({
      name: import_zod4.z.string(),
      fipe: import_zod4.z.number(),
      brand_id: import_zod4.z.string()
    });
    const { name, fipe, brand_id } = registerBodySchema.parse(request.body);
    try {
      await this.createModelUseCase.handle({
        name,
        fipe,
        brand_id
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
    const registerParamsSchema = import_zod4.z.object({ id: import_zod4.z.string() });
    const { id } = registerParamsSchema.parse(request.params);
    try {
      const model = await this.findModelUseCase.handle("id", id);
      return response.status(200).send({ message: "Ok!", code: 200, model });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return response.status(404).send({ message: err.message, code: 404 });
      }
      return response.status(500).send({ message: "internal Server Error", code: 500 });
    }
  }
  async update(request, response) {
    const registerBodySchema = import_zod4.z.object({
      name: import_zod4.z.optional(import_zod4.z.string()),
      fipe: import_zod4.z.optional(import_zod4.z.number())
    });
    const registerParamsSchema = import_zod4.z.object({ id: import_zod4.z.string() });
    const data = registerBodySchema.parse(request.body);
    const { id } = registerParamsSchema.parse(request.params);
    try {
      const model = await this.updateModelUseCase.handle(data, id);
      return response.status(201).send({
        message: "Succesfuly updated!",
        code: 201,
        model
      });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return response.status(404).send({ message: err.message, code: 404 });
      }
      return response.status(500).send({ message: "Internal Server Error", code: 500 });
    }
  }
  async delete(request, response) {
    const registerParamsSchema = import_zod4.z.object({ id: import_zod4.z.string() });
    const { id } = registerParamsSchema.parse(request.params);
    try {
      await this.deleteModelUseCase.handle(id);
      return response.status(200).send({ message: "Succesfully deleted!", code: 200 });
    } catch (err) {
      return response.status(500).send({ message: "internal Server Error", code: 500 });
    }
  }
};

// src/controllers/model/index.ts
var repository3 = new PrismaModelsRepository();
var createModelUseCase = new CreateModelUseCase(repository3);
var findModelUseCase = new FindModelUseCase(repository3);
var updateModelUseCase = new UpdateModelUseCase(repository3);
var deleteModelUseCase = new DeleteModelUseCase(repository3);
var crudModelsController = new ModelsController(
  createModelUseCase,
  findModelUseCase,
  updateModelUseCase,
  deleteModelUseCase
);

// src/routes/model.routes.ts
var routes3 = (0, import_express3.Router)();
routes3.post("/create", async (request, response) => {
  return await crudModelsController.create(request, response);
});
routes3.get("/:id", async (request, response) => {
  return await crudModelsController.find(request, response);
});
routes3.patch("/update/:id", async (request, response) => {
  return await crudModelsController.update(request, response);
});
routes3.delete("/delete/:id", async (request, response) => {
  return await crudModelsController.delete(request, response);
});
var model_routes_default = routes3;

// src/routes/index.ts
var endpoint = (0, import_express4.Router)();
endpoint.use("/car", car_routes_default);
endpoint.use("/model", model_routes_default);
endpoint.use("/brand", brand_routes_default);
var routes_default = endpoint;
