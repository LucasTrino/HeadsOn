export default interface CustomErrors {
  name: string;
  message: string;
  code?: number | string;
  stack?: string;
}