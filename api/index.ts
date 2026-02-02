let cached: any

export default async function handler(req: any, res: any) {
  if (!cached) {
    // dist build pachhi j exist thase; build time ma TS ne ignore karavvu
    // @ts-ignore
    cached = import('../dist/src/app.js')
  }

  const mod: any = await cached
  if (mod.initPromise) {
    await mod.initPromise
  }
    return mod.default(req, res)
}
