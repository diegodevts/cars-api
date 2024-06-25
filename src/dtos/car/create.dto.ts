import { FUEL_TYPE } from '@prisma/client'

export type CreateCarDto = {
  year: string
  color: string
  doors: number
  model_id: string
  fuel_type: FUEL_TYPE
}
