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

// src/repositories/prisma/car.ts
var car_exports = {};
__export(car_exports, {
  PrismaCarsRepository: () => PrismaCarsRepository
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaCarsRepository
});
