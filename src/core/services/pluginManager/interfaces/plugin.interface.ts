import ICoreContext from "../../coreContext/coreContext.interface.js"
import TPluginCommands from "../types/pluginCommands.type.js";

export default interface IPlugin {
  name: string;
  version: string;
  handler: string,
  description?: string,
  initialize: (context: ICoreContext) => Promise<void>;
  shutdown?: () => Promise<void>;
  commands: TPluginCommands;
}