// pluginManager.ts
import IPlugin from "./interfaces/plugin.interface.js";
import IPluginManager from "./pluginManager.interface.js";
import IAppCoreContext from "../../coreAppContext.interface.js";
import IPluginsList from "./interfaces/pluginList.interface.js";

export function createPluginManager(): IPluginManager {
  const pluginRegistry = new Map<string, IPlugin>();

  async function validatePlugin(plugin: IPlugin): Promise<{ isValid: boolean, errors: string[] }> {
    // TODO/OPTMIZE - 1.1.0
    const errors: string[] = [];

    if (!plugin.name?.trim())
      errors.push(`Plugin must have a 'name'.`);

    if (!plugin.version?.trim())
      errors.push(`Plugin must have a 'version'.`);

    if (typeof plugin.handler !== 'string' || plugin.handler.trim().length === 0)
      errors.push(`Command's 'handler' must be a non-empty string.`);

    if (typeof plugin.initialize !== 'function')
      errors.push(`Plugin must have an 'initialize' function.`);

    if (!plugin.commands || Object.keys(plugin.commands).length === 0) {
      errors.push(`Plugin must define at least one command.`);
    } else {
      for (const [commandName, command] of Object.entries(plugin.commands)) {
        if (typeof command.action !== 'function') {
          errors.push(`Command '${commandName}' must to be function.`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async function register(plugin: IPlugin, context: IAppCoreContext): Promise<void> {
    if (pluginRegistry.has(plugin.name)) return;

    try {
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
    validatePlugin,
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
