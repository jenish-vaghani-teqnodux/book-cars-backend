// index.ts (root)
import app from '../src/app'

export default function handler(req: any, res: any) {
  return app(req as any, res as any)
}
