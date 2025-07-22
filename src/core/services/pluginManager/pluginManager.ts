// pluginManager.ts

import IPlugin from "./interfaces/plugin.interface.js";
import IPluginManager from "./pluginManager.interface.js";
import IAppCoreContext from "../../coreAppContext.interface.js";
import IPluginsList from "./interfaces/pluginList.interface.js";

import TCommander from "./types/commander.type.js";
import TPluginCommand from "./types/pluginCommand.type.js";

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

  async function registerPluginCommands(program: TCommander, pluginHandler: string): Promise<void> {
    // TODO/QUESTION - 1.3.0
    const plugin = pluginRegistry.get(pluginHandler);

    if (!plugin) {
      throw new Error(`Plugin "${pluginHandler}" not found.`);
    }

    const commands = Object.entries(plugin.commands);

    for (const [key, details] of commands) {
      await registerCommand(program, plugin, { name: key, ...details });
    }
  }

  // TODO/OPTMIZE - 1.4.0
  async function registerCommand(program: TCommander, plugin: IPlugin, command: TPluginCommand): Promise<void> {
    const cmd = program.command(`${plugin.handler}:${command.name}`)
      .description(command.descriptions);

    // TODO/OPTMIZE - 1.5.0
    for (const option of command.options || []) {
      applyOptionToCommand(cmd, option);
    }

    cmd.action(async (name: string, options: string[]) => {
      const commandAction = command.action;
      await commandAction(name, options);
    });
  }

  // TODO/OPTMIZE - 1.6.0
  function applyOptionToCommand(
    cmd: TCommander,
    option: string | { flags: string; description: string; defaultValue?: string }
  ): void {
    typeof option === 'string' ?
      cmd.option(option) :
      option.flags && cmd.option(option.flags, option.description, option.defaultValue);
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
  function getPlugins(): IPlugin[] {
    return Array.from(pluginRegistry.values());
  }

  function listPlugins(): IPluginsList[] {
    return getPlugins().map(plugin => ({
      name: plugin.name,
      version: plugin.version,
      description: plugin.description ?? '',
    }));
  }

  return Object.freeze<IPluginManager>({
    plugins: pluginRegistry,
    registerPlugin: register,
    getPlugins,
    getPluginsCommands: getPluginCommands,
    listPlugins,
    registerPluginCommands,
  });
}

// Singleton
const pluginManager = createPluginManager();
export default pluginManager;
