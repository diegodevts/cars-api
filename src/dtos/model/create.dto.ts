import { FUEL_TYPE } from '@prisma/client'

export type CreateModelDto = {
  name: string
  fipe: number
  brand_id: string
}
