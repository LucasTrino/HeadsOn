// Interfaces Imports
import IPlugin from "./interfaces/plugins/plugin.interface.js"
import IPluginManager from "./interfaces/plugins/pluginManager.interface.js"
import IAppCoreContext from "./interfaces/appCoreContext.interface.js"
import IPluginsList from "./interfaces/plugins/pluginList.interface.js";
// Types Imports
import TCommander from "./types/commander.type.js";

export default pluginManager;

let instance: IPluginManager;

function pluginManager(): IPluginManager {
  const plugins = new Map();

  if (instance) return instance;

  const registerPlugin = async (plugin: IPlugin, appContext: IAppCoreContext): Promise<void> => {
    if (plugins.has(plugin.name)) return;

    if (!plugin.name || !plugin.version) throw new Error("Plugins must have 'name' and/or 'version' properties.");

    if (!plugin.initialize) throw new Error("Plugin must have a 'initialization' function.");

    if (!plugin.commands) throw new Error("Plugin must have a 'commands' propertie.");

    if (!Object.entries(plugin.commands).length) throw new Error("Plugin must have at least one command.");


    // TODO/OPTMIZE - 1.1.0

    if (typeof plugin.initialize !== 'function') throw new Error("Plugin initialization function must to be a function.");

    const commands = new Map();

    for (const [commandName, commandDetails] of Object.entries(plugin.commands || {})) {
      if (!commands.has(commandName)) {
        commands.set(commandName, commandDetails);
      }
    }

    // TODO/FIXME - 1.2.0
    const deepPlugin = JSON.parse(JSON.stringify(plugin));
    deepPlugin.commands = commands;

    try {
      await plugin.initialize(appContext);
    } catch (error: any) {
      throw new Error(`Failed to initialize plugin: ${plugin.name} with error: ${error.message}`)
    }

    plugins.set(plugin.name, deepPlugin);
  }

  async function registerPluginCommands(program: TCommander): Promise<void> {
    // TODO/QUESTION - 1.3.0
    const plugins = getPlugins();
    const allCommands = plugins.flatMap(plugin =>
      getPluginsCommands(plugin.name).map(command => ({
        plugin,
        command
      }))
    );

    for (const { plugin, command } of allCommands) {
      await registerCommand(program, plugin, command);
    }
  }

  // TODO/OPTMIZE - 1.4.0
  async function registerCommand(program: TCommander, plugin: any, command: any): Promise<void> {
    const cmd = program.command(`${plugin.handler}:${command.name}`)
      .description(command.details.descriptions);

    // TODO/OPTMIZE - 1.5.0
    for (const option of command.details.options || []) {
      registerOptions(cmd, option);
    }

    cmd.action(async (name: string, options: string[]) => {
      const commandAction = command.details.action;
      await commandAction(name, options);
    });
  }

  // TODO/OPTMIZE - 1.6.0
  function registerOptions(cmd: TCommander, option: string | { flags: string, description: string, defaultValue: string }): void {
    typeof option === 'string' ?
      cmd.option(option) :
      option.flags && cmd.option(option.flags, option.description, option.defaultValue);
  }
  // TODO/QUESTION - 1.3.0
  const getPluginsCommands = (plugin: string): any[] => {
    return Array.from<[string, any]>(
      plugins.get(plugin).commands.entries()
    ).map(([name, details]) => ({ name, details }));
  }

  const getPlugins = (): {
    name: string,
    version: string,
    description: string,
    handler: string,
    commands: Map<string, IPlugin>
  }[] => {
    return Array.from(plugins.entries()).map(([name, plugin]) => ({
      name,
      version: plugin.version,
      description: plugin.description,
      handler: plugin.handler,
      commands: plugin.commands
    }));
  }

  const listPlugins = (): IPluginsList[] => {
    return Array.from(plugins.entries()).map(([name, plugin]) => ({
      name: name,
      version: plugin.version,
      description: plugin?.description ? plugin.description : ''
    }));
  }

  instance = {
    plugins: plugins,
    getPluginsCommands: getPluginsCommands,
    getPlugins: getPlugins,
    registerPlugin: registerPlugin,
    listPlugins: listPlugins,
    registerPluginCommands
  }

  return instance;
}


