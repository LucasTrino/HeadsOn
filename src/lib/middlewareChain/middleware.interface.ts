import * as MiddlewareType from './middleware.type.js';

export default interface MiddlewareChain<T extends MiddlewareType.TMiddlewareContext = MiddlewareType.TMiddlewareContext> {
  use: (middleware: MiddlewareType.TMiddleware<T>) => MiddlewareChain<T>;
  handle: (context: T, onError?: MiddlewareType.TErrorHandler) => Promise<void>;
  clear: () => MiddlewareChain<T>;
}