export interface GenericRepository<T, C, U> {
  findBy(field: string, data: string): Promise<T | null>
  findAll(skip: number, take: number): Promise<T[]>
  create(data: C): Promise<void>
  update(data: U, id: string): Promise<T | null>
  delete(id: string): Promise<void>
}
