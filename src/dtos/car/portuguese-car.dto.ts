import { FUEL_TYPE } from '@prisma/client'

export type PortugueseCar = {
  id: string
  timestamp_cadastro: bigint
  model_id: string
  ano: string
  combustivel: FUEL_TYPE
  num_portas: number
  cor: string
  nome_modelo: string
  valor: number
}
