import IPlugin from "./plugins/plugin.interface.js"

export default interface IPluginManager {
  plugins: Map<string, IPlugin>,
  commands: Map<string, (...args: any[]) => Promise<any>>,
  registerPlugin: (plugin: IPlugin) => Promise<void>,
  getPlugin: (pluginName: string) => IPlugin,
  listPlugins: () => object[]
}