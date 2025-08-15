import IPlugin from "./interfaces/plugin.interface.js";
import IAppCoreContext from "../../coreAppContext.interface.js";
import IPluginsList from "./interfaces/pluginList.interface.js";
import TCommander from "./types/commander.type.js";
import TPluginCommands from "./types/pluginCommands.type.js";

export default interface IPluginManager {
  validatePlugin(plugin: IPlugin): Promise<{ isValid: boolean, errors: string[] }>;
  registerPlugin(plugin: IPlugin, context: IAppCoreContext): Promise<void>;
  getAllPlugins(): IPlugin[];
  getSinglePlugin(name: string): IPlugin | undefined;
  getPluginsCommands(pluginName: string): {
    name: string;
    details: {
      description: string;
      options?: (string | { flags: string; description: string; defaultValue?: string })[];
      action: (...args: any[]) => Promise<void>;
    };
  }[];
  listPlugins(): IPluginsList[];
}