import { Router } from 'express'
import carRoutes from './car.routes'
import brandRoutes from './brand.routes'
import modelRoutes from './model.routes'

const endpoint = Router()

endpoint.use('/car', carRoutes)
endpoint.use('/model', modelRoutes)
endpoint.use('/brand', brandRoutes)

export default endpoint
