import cors from 'cors'
import * as logger from '../utils/logger'

/**
 * CORS configuration.
 *
 * @type {cors.CorsOptions}
 */
const CORS_CONFIG: cors.CorsOptions = {
  origin: true, // allow all origins
  credentials: true,
  optionsSuccessStatus: 200,
}

export default () => cors(CORS_CONFIG)

