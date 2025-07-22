// Interfaces Imports
import MiddlewareChain from './middleware.interface.js';

// Types Imports
import * as MiddlewareType from './middleware.type.js';

export default createMiddleware;

export function createMiddleware<T extends MiddlewareType.TMiddlewareContext = MiddlewareType.TMiddlewareContext>(): MiddlewareChain<T> {
  let middlewares: MiddlewareType.TMiddleware<T>[] = [];

  const chain: MiddlewareChain<T> = {
    use(middleware: MiddlewareType.TMiddleware<T>): MiddlewareChain<T> {
      if (typeof middleware !== 'function') {
        throw new TypeError('Middleware must be a function');
      }

      middlewares.push(middleware);
      return chain;
    },

    async handle(context: T, onError?: MiddlewareType.TErrorHandler): Promise<void> {
      let index = 0;
      const pipelines = [...middlewares];

      const next = async (error?: unknown): Promise<void> => {
        if (error) {
          if (onError) {
            return await onError(error, context);
          }
          throw error;
        }

        if (index >= pipelines.length) {
          return;
        }

        const layer = pipelines[index++];

        try {
          await layer(context, next);
        } catch (err) {
          await next(err);
        }
      };

      return next();
    },

    clear(): MiddlewareChain<T> {
      middlewares = [];
      return chain;
    }
  }

  return chain;
}

