// TODO/QUESTION - 2.0.0
export type TMiddlewareContext<T = Record<string, unknown>> = T & {
  [key: string]: unknown;
};

export type TNextFunction = (error?: unknown) => Promise<void>;
export type TErrorHandler = (error: unknown, context: TMiddlewareContext) => Promise<void> | void;
export type TMiddleware<T extends TMiddlewareContext = TMiddlewareContext> = (
  ctx: T,
  next: TNextFunction
) => Promise<void> | void;
