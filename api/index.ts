import app, { initPromise } from '../src/app.js'

export default async function handler(req: any, res: any) {
  await initPromise
  return app(req as any, res as any)
}
