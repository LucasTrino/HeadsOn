import IPlugin from "./interfaces/plugins/plugin.interface.js"
import IPluginManager from "./interfaces/plugins/pluginManager.interface.js"
import IAppCoreContext from "./interfaces/appCoreContext.interface.js"

export default pluginManager;

let instance: IPluginManager;

function pluginManager(appContext: IAppCoreContext): IPluginManager {
  const plugins = new Map();
  const commands = new Map();

  if (instance) return instance;

  const registerPlugin = async (plugin: IPlugin): Promise<void> => {
    if (plugins.has(plugin.name)) return;

    // Validando interface do plugin
    if (!plugin.name || !plugin.version) throw new Error("Plugins must have 'name' and/or 'version' properties.");

    if (!plugin.initialize) throw new Error("Plugin must have a 'initialization' function.");

    if (!plugin.commands) throw new Error("Plugin must have a 'commands' propertie.");

    if (!Object.entries(plugin.commands).length) throw new Error("Plugin must have at least one command.");

    if (typeof plugin.initialize !== 'function') throw new Error("Plugin initialization function must to be a function.");

    for (const [commandName, commandAction] of Object.entries(plugin.commands || {})) {
      if (!commands.has(commandName)) {
        commands.set(commandName, commandAction);
      }
    }

    try {
      await plugin.initialize(appContext);
    } catch (error: any) {
      throw new Error(`Failed to initialize plugin: ${plugin.name} with error: ${error.message}`)
    }

    plugins.set(plugin.name, plugin);
  }

  const getPlugin = (pluginName: string): IPlugin => {
    return plugins.get(pluginName);
  }

  const listPlugins = () => {
    return Array.from(plugins.entries()).map(([name, plugin]) => ({
      name,
      version: plugin.version,
      description: plugin?.description ? plugin.description : `<This plugin doens't have a description>`
    }));
  }

  instance = {
    plugins: plugins,
    commands: commands,
    registerPlugin: registerPlugin,
    getPlugin: getPlugin,
    listPlugins
  }

  return instance;
}


