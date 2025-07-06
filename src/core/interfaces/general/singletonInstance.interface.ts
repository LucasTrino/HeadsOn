export default interface ISingletonInstance {
  init: (...args: any[]) => void
}