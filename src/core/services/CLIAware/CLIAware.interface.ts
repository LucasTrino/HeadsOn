export default interface ICLIAware {
  init: (context: {}) => Promise<void>;
}