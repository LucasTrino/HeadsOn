import IAppCoreContext from "../appCoreContext.interface.js"

export default interface IPlugin {
  name: string;
  version: string;
  description?: string,
  initialize?: (context: IAppCoreContext) => Promise<void>;
  shutdown?: () => Promise<void>;
  commands: {
    [key: string]: (...options: any[]) => Promise<any> | Function;
  };
}