import { randomUUID } from 'crypto'
import { GenericRepository } from '../generic-repository'

export const id = randomUUID()

export class InMemoryGenericRepository<T extends C, C, U>
  implements GenericRepository<T, C, U>
{
  public items: T[] = []

  async create(data: C): Promise<void> {
    this.items.push({ ...data, timestamp: Date.now(), id } as T)
  }

  async findBy(field: string, data: string): Promise<T | null> {
    const item = this.items.find((item) => item[field] === data)

    return item ?? null
  }

  async findAll(skip: number, take: number): Promise<T[]> {
    return this.items.slice(+skip, +take)
  }

  async update(data: U, id: string): Promise<T | null> {
    const data_to_update = this.items.find((data) => data['id'] === id)
    if (data_to_update) {
      Object.assign(data_to_update, data)
    }

    return data_to_update
  }

  async delete(id: string): Promise<void> {
    const data = this.items.find((item) => item['id'] === id)
    const itemIndex = this.items.indexOf(data as T)

    this.items.splice(itemIndex, 1)
  }
}
