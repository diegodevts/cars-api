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

// src/usecases/model/find-model.usecase.ts
var find_model_usecase_exports = {};
__export(find_model_usecase_exports, {
  FindModelUseCase: () => FindModelUseCase
});
module.exports = __toCommonJS(find_model_usecase_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FindModelUseCase
});
