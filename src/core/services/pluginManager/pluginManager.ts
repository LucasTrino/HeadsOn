// pluginManager.ts
import IPlugin from "./interfaces/plugin.interface.js";

import IPluginManager from "./interfaces/pluginManager.interface.js";
import ICoreContext from "../coreContext/coreContext.interface.js";
import IPluginsList from "./interfaces/pluginList.interface.js";

import metadataValidationProperties from './metadataValidationProperties.js'
import createPluginValidation from "../pluginValidator/pluginManagerValidation.js";


export function createPluginManager(): IPluginManager {
  const pluginRegistry = new Map<string, IPlugin>();



  async function validatePlugin(plugin: IPlugin): Promise<{ isValid: boolean, errors: string[] }> {
    // TODO/OPTMIZE - 1.1.0
    let errors: string[] = [];

    const validator = createPluginValidation();

    const metadaValidation = validator.validatePluginMetadatas(plugin, metadataValidationProperties);
    const initializeFunctionValidation = validator.validatePluginsInitializationFunction(plugin);
    const commandsValidation = validator.validatePluginCommands(plugin)

    if (!metadaValidation.isValid)
      errors = [...metadaValidation.errors];

    if (!initializeFunctionValidation.isValid)
      errors = [...metadaValidation.errors];

    if (!commandsValidation.isValid)
      errors = [...commandsValidation.errors]

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async function register(plugin: IPlugin, context: ICoreContext): Promise<void> {
    if (pluginRegistry.has(plugin.name)) return;

    try {
      await plugin.initialize(context);
    } catch (err: any) {
      throw new Error(`Failed to initialize plugin "${plugin.name}": ${err.message}`);
    }

    pluginRegistry.set(plugin.handler, plugin);
  }

  // TODO/OPTMIZE - 3.8.4
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
