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

// src/usecases/car/find-cars.usecase.ts
var find_cars_usecase_exports = {};
__export(find_cars_usecase_exports, {
  FindCarsUseCase: () => FindCarsUseCase
});
module.exports = __toCommonJS(find_cars_usecase_exports);
var FindCarsUseCase = class {
  constructor(genericRepository) {
    this.genericRepository = genericRepository;
  }
  async handle(skip, take) {
    const cars = await this.genericRepository.findAll(skip, take);
    return cars;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FindCarsUseCase
});
