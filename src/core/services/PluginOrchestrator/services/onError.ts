import { TMiddlewareContext, TErrorHandler } from "../../../../lib/middleware/middleware.type.js";

export default onError;

async function onError(error: unknown, context: TMiddlewareContext): Promise<void> {
  console.error(error)
  throw error;
}