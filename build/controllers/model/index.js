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

// src/controllers/model/index.ts
var model_exports = {};
__export(model_exports, {
  crudModelsController: () => crudModelsController
});
module.exports = __toCommonJS(model_exports);

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

// src/errors/resource-not-found.error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
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
var import_zod2 = require("zod");
var ModelsController = class {
  constructor(createModelUseCase2, findModelUseCase2, updateModelUseCase2, deleteModelUseCase2) {
    this.createModelUseCase = createModelUseCase2;
    this.findModelUseCase = findModelUseCase2;
    this.updateModelUseCase = updateModelUseCase2;
    this.deleteModelUseCase = deleteModelUseCase2;
  }
  async create(request, response) {
    const registerBodySchema = import_zod2.z.object({
      name: import_zod2.z.string(),
      fipe: import_zod2.z.number(),
      brand_id: import_zod2.z.string()
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
    const registerParamsSchema = import_zod2.z.object({ id: import_zod2.z.string() });
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
    const registerBodySchema = import_zod2.z.object({
      name: import_zod2.z.optional(import_zod2.z.string()),
      fipe: import_zod2.z.optional(import_zod2.z.number())
    });
    const registerParamsSchema = import_zod2.z.object({ id: import_zod2.z.string() });
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
    const registerParamsSchema = import_zod2.z.object({ id: import_zod2.z.string() });
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
var repository = new PrismaModelsRepository();
var createModelUseCase = new CreateModelUseCase(repository);
var findModelUseCase = new FindModelUseCase(repository);
var updateModelUseCase = new UpdateModelUseCase(repository);
var deleteModelUseCase = new DeleteModelUseCase(repository);
var crudModelsController = new ModelsController(
  createModelUseCase,
  findModelUseCase,
  updateModelUseCase,
  deleteModelUseCase
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  crudModelsController
});
