import IPlugin from "./interfaces/plugin.interface.js";
import IAppCoreContext from "../../coreAppContext.interface.js";
import IPluginsList from "./interfaces/pluginList.interface.js";
import TCommander from "./types/commander.type.js";

export default interface IPluginManager {
  plugins: Map<string, IPlugin>;

  registerPlugin(plugin: IPlugin, context: IAppCoreContext): Promise<void>;

  getPlugins(): IPlugin[];

  getPluginsCommands(pluginName: string): {
    name: string;
    details: {
      description: string;
      options?: (string | { flags: string; description: string; defaultValue?: string })[];
      action: (...args: any[]) => Promise<void>;
    };
  }[];

  listPlugins(): IPluginsList[];

  registerPluginCommands(program: TCommander): Promise<void>;
}