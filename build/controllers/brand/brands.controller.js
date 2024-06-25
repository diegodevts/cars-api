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

// src/controllers/brand/brands.controller.ts
var brands_controller_exports = {};
__export(brands_controller_exports, {
  BrandsController: () => BrandsController
});
module.exports = __toCommonJS(brands_controller_exports);
var import_zod = require("zod");

// src/errors/resource-not-found.error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/controllers/brand/brands.controller.ts
var BrandsController = class {
  constructor(createBrandUseCase, findBrandUseCase, updateBrandUseCase, deleteBrandUseCase) {
    this.createBrandUseCase = createBrandUseCase;
    this.findBrandUseCase = findBrandUseCase;
    this.updateBrandUseCase = updateBrandUseCase;
    this.deleteBrandUseCase = deleteBrandUseCase;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrandsController
});
