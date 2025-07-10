export default interface ISingletonInstance {
  [key: string]: (...args: any[]) => any
}