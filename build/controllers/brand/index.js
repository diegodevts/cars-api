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

// src/controllers/brand/index.ts
var brand_exports = {};
__export(brand_exports, {
  crudBrandsController: () => crudBrandsController
});
module.exports = __toCommonJS(brand_exports);

// src/controllers/brand/brands.controller.ts
var import_zod = require("zod");

// src/errors/resource-not-found.error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/controllers/brand/brands.controller.ts
var BrandsController = class {
  constructor(createBrandUseCase2, findBrandUseCase2, updateBrandUseCase2, deleteBrandUseCase2) {
    this.createBrandUseCase = createBrandUseCase2;
    this.findBrandUseCase = findBrandUseCase2;
    this.updateBrandUseCase = updateBrandUseCase2;
    this.deleteBrandUseCase = deleteBrandUseCase2;
  }
  async create(request, response) {
    const registerBodySchema = import_zod.z.object({
      name: import_zod.z.string()
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
    const registerParamsSchema = import_zod.z.object({ id: import_zod.z.string() });
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
    const registerBodySchema = import_zod.z.object({
      name: import_zod.z.optional(import_zod.z.string())
    });
    const registerParamsSchema = import_zod.z.object({ id: import_zod.z.string() });
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
    const registerParamsSchema = import_zod.z.object({ id: import_zod.z.string() });
    const { id } = registerParamsSchema.parse(request.params);
    try {
      await this.deleteBrandUseCase.handle(id);
      return response.status(200).send({ message: "Succesfully deleted!", code: 200 });
    } catch (err) {
      return response.status(500).send({ message: "internal Server Error", code: 500 });
    }
  }
};

// env/index.ts
var import_config = require("dotenv/config");
var import_zod2 = require("zod");
var envSchema = import_zod2.z.object({
  NODE_ENV: import_zod2.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod2.z.coerce.number().default(3e3),
  DATABASE_URL: import_zod2.z.string()
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
var repository = new PrismaBrandsRepository();
var createBrandUseCase = new CreateBrandUseCase(repository);
var findBrandUseCase = new FindBrandUseCase(repository);
var updateBrandUseCase = new UpdateBrandUseCase(repository);
var deleteBrandUseCase = new DeleteBrandUseCase(repository);
var crudBrandsController = new BrandsController(
  createBrandUseCase,
  findBrandUseCase,
  updateBrandUseCase,
  deleteBrandUseCase
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  crudBrandsController
});
