// TODO/OPTMIZE - 3.8.0
// CLIAdapter.ts
import { Command } from 'commander';

import IPlugin from '../../core/services/pluginManager/interfaces/plugin.interface.js';
import ICLIAdapter from './CLIAdapter.interface.js';

import TPluginCommand from '../../core/services/pluginManager/types/pluginCommand.type.js';
import TCommander from '../../core/services/pluginManager/types/commander.type.js';
import TPluginOption from '../../core/services/pluginManager/types/pluginOption.type.js';
import TCommandContext from './types/commandContext.type.js';

// TODO/OPTMIZE - 3.8.3
import { validateCommand } from './helpers/commandValidation.js'
import ICoreContext from '../../core/services/coreContext/coreContext.interface.js';

// TODO/OPTIMIZE - 3.3.0
function CreateCLIAdapter(): ICLIAdapter {
  const program = new Command();
  const registeredCommands = new Map<string, TCommandContext>();

  // TODO/OPTMIZE - 3.7.0
  function initialize(): TCommander {
    program
      .name('HeadsOn')
      .description('CLI para minha aplicação')
      .version('1.0.0');

    return program;
  }

  function parse(argv: string[]): Promise<TCommander> {
    if (!Array.isArray(argv)) {
      throw new Error('CLIAdapter: parse expects an array of arguments');
    }

    return program.parseAsync(argv);
  }

  function getCommander(): TCommander {
    return program;
  }

  function getCommand(commandKey: string): TCommandContext | undefined {
    return registeredCommands.has(commandKey) ? registeredCommands.get(commandKey) : undefined;
  }

  function applyOptionToCommand(
    cmdInstance: TCommander,
    option: TPluginOption
  ): TCommander {

    if (!option || !cmdInstance)
      throw new TypeError("'option' and/or 'cmdInstance' parameters must be passed.");

    if (typeof option === 'string') {
      cmdInstance.option(option);
    } else if (option.flags) {
      cmdInstance.option(
        option.flags,
        option.description,
        option.defaultValue
      );
    }

    return cmdInstance;
  }

  async function registerOptions(cmdInstance: TCommander, options: TPluginOption[]): Promise<TCommander> {

    if (typeof options === 'undefined' || options.length === 0)
      throw new TypeError("Command's 'options' must to be a non-empty array.");

    for (const option of options) {
      applyOptionToCommand(cmdInstance, option)
    }

    return cmdInstance
  }

  async function registerCommand(command: TPluginCommand, appContext: ICoreContext, handler?: string): Promise<TCommandContext> {
    let cmdInstance, context;

    try {
      validateCommand(command);

      const { name, options, description, action } = command;

      const commandKey = typeof handler !== 'undefined' ?
        `${handler}:${name}` :
        name;

      if (registeredCommands.has(commandKey)) {
        throw new Error(`Command ${commandKey} already registered.`);
      }

      cmdInstance = program.command(commandKey);

      cmdInstance.description(description);

      cmdInstance.hook('preAction', (thisCommand: any) => {
        thisCommand.coreContext = appContext;
      })

      cmdInstance.action(async (...args: any[]) => {
        try {
          await action(...args);
        } catch (error) {
          console.error(`Error executing command ${commandKey}: ${error}`);
          throw error;
        }
      });

      if (typeof options !== 'undefined')
        registerOptions(cmdInstance, options)

      context = { commandKey, command, cmdInstance };

      registeredCommands.set(commandKey, context);

      return context;

    } catch (error: any) {
      throw error;
    }

  }
  // TODO/OPTMIZE - 3.8.2
  async function registerPlugin(plugin: IPlugin, appContext: ICoreContext): Promise<IPlugin> {
    const { handler, commands } = plugin;

    if (typeof handler !== 'string' || handler.trim().length === 0)
      throw new TypeError("Command's 'handler' must be a non-empty string.");

    if (!handler || !commands)
      throw new Error("Plugin must have handler and commands.");

    const commandsEntries = Object.entries(commands);

    if (!commandsEntries.length)
      throw new Error(`No commands provided in the plugin: ${handler}`);

    const results = await Promise.allSettled(commandsEntries.map(([name, config]) =>
      registerCommand({ name, ...config }, appContext, handler)
    ));

    for (const result of results) {
      if (result.status === 'rejected') {
        console.warn(`Failed to register plugin commands for ${handler}:`, result.reason);
      }
    }

    return plugin;
  }

  return Object.freeze({
    initialize,
    parse,
    getCommander,
    getCommand,
    applyOptionToCommand,
    registerOptions,
    registerCommand,
    registerPlugin
  })
}

// Singleton
const CLIAdapter = CreateCLIAdapter();
export default CLIAdapter;