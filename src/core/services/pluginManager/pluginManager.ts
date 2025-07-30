// pluginManager.ts
import IPlugin from "./interfaces/plugin.interface.js";
import IPluginManager from "./pluginManager.interface.js";
import IAppCoreContext from "../../coreAppContext.interface.js";
import IPluginsList from "./interfaces/pluginList.interface.js";

export function createPluginManager(): IPluginManager {
  const pluginRegistry = new Map<string, IPlugin>();

  async function validatePlugin(plugin: IPlugin): Promise<void> {
    // TODO/OPTMIZE - 1.1.0
    if (!plugin.name || !plugin.version) throw new Error("Plugins must have 'name' and 'version'.");
    if (!plugin.initialize || typeof plugin.initialize !== 'function') {
      throw new Error("Plugin must have an 'initialize' function.");
    }
    if (!plugin.commands || Object.keys(plugin.commands).length === 0) {
      throw new Error("Plugin must define at least one command.");
    }
  }

  async function register(plugin: IPlugin, context: IAppCoreContext): Promise<void> {
    if (pluginRegistry.has(plugin.name)) return;

    try {
      await validatePlugin(plugin);
      await plugin.initialize(context);
    } catch (err: any) {
      throw new Error(`Failed to initialize plugin "${plugin.name}": ${err.message}`);
    }

    pluginRegistry.set(plugin.handler, plugin);
  }

  function getPluginCommands(pluginName: string): { name: string; details: any }[] {
    const plugin = pluginRegistry.get(pluginName);
    if (!plugin) return [];

    return Object.entries(plugin.commands).map(([name, details]) => ({
      name,
      details,
    }));
  }

  // TODO/QUESTION - 1.3.0
  function getAllPlugins(): IPlugin[] {
    return Array.from(pluginRegistry.values());
  }

  function getSinglePlugin(name: string): IPlugin | undefined {
    return pluginRegistry.has(name) ?
      pluginRegistry.get(name) :
      undefined;
  }

  // TODO/OPTIMIZE - 3.2.0
  function listPlugins(): IPluginsList[] {
    return getAllPlugins().map(plugin => ({
      name: plugin.name,
      version: plugin.version,
      description: plugin.description ?? '',
    }));
  }

  return Object.freeze<IPluginManager>({
    registerPlugin: register,
    getAllPlugins,
    getSinglePlugin,
    getPluginsCommands: getPluginCommands,
    listPlugins
  });
}

// Singleton
const pluginManager = createPluginManager();
export default pluginManager;
