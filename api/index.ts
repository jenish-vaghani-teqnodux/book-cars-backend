// index.ts (root)
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { start } from "src";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return start()
}
