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

// src/repositories/in-memory/generic-in-memory-repository.ts
var generic_in_memory_repository_exports = {};
__export(generic_in_memory_repository_exports, {
  InMemoryGenericRepository: () => InMemoryGenericRepository,
  id: () => id
});
module.exports = __toCommonJS(generic_in_memory_repository_exports);
var import_crypto = require("crypto");
var id = (0, import_crypto.randomUUID)();
var InMemoryGenericRepository = class {
  constructor() {
    this.items = [];
  }
  async create(data) {
    this.items.push({ ...data, timestamp: Date.now(), id });
  }
  async findBy(field, data) {
    const item = this.items.find((item2) => item2[field] === data);
    return item ?? null;
  }
  async findAll(skip, take) {
    return this.items.slice(+skip, +take);
  }
  async update(data, id2) {
    const data_to_update = this.items.find((data2) => data2["id"] === id2);
    if (data_to_update) {
      Object.assign(data_to_update, data);
    }
    return data_to_update;
  }
  async delete(id2) {
    const data = this.items.find((item) => item["id"] === id2);
    const itemIndex = this.items.indexOf(data);
    this.items.splice(itemIndex, 1);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryGenericRepository,
  id
});
