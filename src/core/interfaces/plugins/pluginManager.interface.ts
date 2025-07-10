import IPlugin from "./plugin.interface.js"
import IAppCoreContext from "../appCoreContext.interface.js"


export default interface IPluginManager {
  plugins: Map<string, IPlugin>,
  commands: Map<string, (...args: any[]) => Promise<any>>,
  registerPlugin: (plugin: IPlugin, context: IAppCoreContext) => Promise<void>,
  getPlugin: (pluginName: string) => IPlugin,
  //TODO: criar interface listPlugin
  listPlugins: () => {name: string, version: string, description: string}[]
}