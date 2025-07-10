import ISingletonInstance from "../singletons/singletonInstance.interface.js";

export default interface ICoreApp extends ISingletonInstance {
  init: () => Promise<void>;
}