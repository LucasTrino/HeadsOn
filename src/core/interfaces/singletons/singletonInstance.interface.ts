// TODO/OPTMIZE - 1.9.0
export default interface ISingletonInstance<T = Record<string, unknown>> {
  [key: string]:
  | ((...args: unknown[]) => unknown)
  | unknown
  | T;
}