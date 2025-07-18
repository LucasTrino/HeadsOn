export default interface ICLIAware {
  init: () => Promise<void>;
}