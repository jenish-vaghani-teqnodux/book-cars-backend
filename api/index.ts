let cached: any

export default async function handler(req: any, res: any) {
  if (!cached) {
    cached = import('../dist/src/app.js')
  }

  const mod: any = await cached
  if (mod.initPromise) {
    await mod.initPromise
  }
  return mod.default(req, res)
}
