import ISingletonInstance from "../singletons/singletonInstance.interface.js"

export default interface ICLIAware extends ISingletonInstance {
  init: () => Promise<void>;
}