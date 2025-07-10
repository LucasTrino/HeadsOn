import IPlugin from "./plugin.interface.js"
import IAppCoreContext from "../appCoreContext.interface.js"
import ISingletonInstance from "../singletons/singletonInstance.interface.js"
import IPluginsList from "./pluginList.interface.js";
// Types Imports
import TCommander from "../../types/commander.type.js";


export default interface IPluginManager extends ISingletonInstance<{
  plugins: Map<string, IPlugin>;
  // commands: Map<string, (...args: any[]) => Promise<any>>;
}> {
  readonly plugins: Map<string, IPlugin>;
  // readonly commands: TPluginCommands;
  // getCommandsList: () => { name: string, action: (...args: unknown[]) => unknown }[],
  registerPlugin: (plugin: IPlugin, context: IAppCoreContext) => Promise<void>,
  getPluginsCommands: (plugin: string) => any[];
  registerPluginCommands: (program: TCommander) => Promise<void>,
  getPlugins: () => {
    name: string,
    version: string,
    description: string,
    handler: string,
    commands: Map<string, IPlugin>
  }[];
  listPlugins: () => IPluginsList[]
}