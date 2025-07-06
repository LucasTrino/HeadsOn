export default interface CustomError {
  name: string;
  message: string;
  code?: number | string;
  stack?: string;
}