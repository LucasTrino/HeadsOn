import IAppCoreContext from "../../../coreAppContext.interface.js"
import TPluginCommands from "../types/pluginCommands.type.js";

export default interface IPlugin {
  name: string;
  version: string;
  handler: string,
  description?: string,
  initialize: (context: IAppCoreContext) => Promise<void>;
  shutdown?: () => Promise<void>;
  commands: TPluginCommands;
}