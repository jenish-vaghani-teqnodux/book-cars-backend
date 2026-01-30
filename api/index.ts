import app from '../src/app'
import * as databaseHelper from '../src/utils/databaseHelper'
import * as env from '../src/config/env.config'

let dbReady = false

async function ensureDb() {
  if (!dbReady) {
    const connected = await databaseHelper.connect(
      env.DB_URI,
      env.DB_SSL,
      env.DB_DEBUG
    )
    const initialized = await databaseHelper.initialize()

    if (!connected || !initialized) {
      throw new Error('DB init failed')
    }

    dbReady = true
  }
}

export default async function handler(req: any, res: any) {
  try {
    await ensureDb()
    return app(req, res)
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: 'Init failed'
    })
  }
}
