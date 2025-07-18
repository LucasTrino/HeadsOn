import IAppCoreContext from "../../../coreAppContext.interface.js"

export default interface IPlugin {
  name: string;
  version: string;
  handler: string,
  description?: string,
  initialize: (context: IAppCoreContext) => Promise<void>;
  shutdown?: () => Promise<void>;
  commands: {
    [key: string]: {
      options: string[],
      descriptions: string,
      action: (...options: any[]) => Promise<any> | Function;
    }
  }
}