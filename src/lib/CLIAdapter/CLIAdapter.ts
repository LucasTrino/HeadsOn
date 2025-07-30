// CLIAdapter.ts
import { Command } from 'commander';

import IPlugin from '../../core/services/pluginManager/interfaces/plugin.interface.js';
import ICLIAdapter from './CLIAdapter.interface.js';

import TPluginCommand from '../../core/services/pluginManager/types/pluginCommand.type.js';
import TCommander from '../../core/services/pluginManager/types/commander.type.js';
import TPluginOption from '../../core/services/pluginManager/types/pluginOption.type.js';
import TPluginCommands from '../../core/services/pluginManager/types/pluginCommands.type.js';

// TODO/OPTIMIZE - 3.3.0
function CreateCLIAdapter(): ICLIAdapter {
  const program = new Command();
  const registeredCommands = new Map<string, TPluginCommand>();

  function initializeCLI(): void {
    program
      .name('HeadsOn')
      .description('CLI para minha aplicação')
      .version('1.0.0');
  }

  function parseCLI(argv: string[]): TCommander {
    if (!Array.isArray(argv)) {
      throw new Error('CLIAdapter: parseCLI expects an array of arguments');
    }

    return program.parse(argv);
  }

  function getCommanderCLI(): TCommander {
    return program;
  }

  function addOptions(
    pcmd: TCommander,
    option: TPluginOption
  ): TCommander {

    if (typeof option === 'string') {
      pcmd.option(option);
    } else if (option.flags) {
      pcmd.option(
        option.flags,
        option.description,
        option.defaultValue
      );
    }
    return pcmd;
  }

  function registerCommandOptions(pcmd: TCommander, options: TPluginOption[]): TCommander {

    if (typeof options === 'undefined' || options.length === 0)
      throw new TypeError("Command's 'options' must to be a non-empty array.");

    for (const option of options) {
      addOptions(pcmd, option)
    }

    return pcmd;
  }

  function addCommand(handler: string, command: TPluginCommand): TCommander {
    const { name, description, action } = command;

    // TODO/OPTIMIZE - 3.5.0
    if (command === null || typeof command !== 'object')
      throw new TypeError("command parameter must be a non-null object.");

    if (typeof name !== 'string' || name.trim().length === 0)
      throw new TypeError("Command's 'name' must be a non-empty string.");

    if (typeof handler !== 'string' || handler.trim().length === 0)
      throw new TypeError("Command's 'handler' must be a non-empty string.");

    if (typeof action !== 'function')
      throw new TypeError("Command must have an 'action' function.");

    if ('description' in command && typeof command.description !== 'string')
      throw new TypeError("Command 'description' must be a string if provided");

    const commandKey = `${handler}:${command.name}`;

    if (registeredCommands.has(commandKey)) {
      throw new Error(`Command ${commandKey} already registered`);
    }

    const pcmd = program.command(commandKey);

    pcmd.description(description);

    pcmd.action(async (name: string, options: TPluginOption[]) => {
      try {
        await command.action(name, options);
      } catch (error) {
        throw new Error(`Error executing command ${commandKey}: ${error}`);
      }
    });

    registeredCommands.set(commandKey, command);

    return pcmd;
  }

  function registerPluginCommands(handler: string, commands: TPluginCommands): Promise<Array<{
    name: string;
    command: TPluginCommand,
    pcmd: TCommander;
    handler: string;
  }>> {
    return new Promise((resolve, reject) => {
      if (typeof handler !== 'string' || handler.trim().length === 0)
        reject(new TypeError("Command's 'handler' must be a non-empty string."));

      if (commands === null || typeof commands !== 'object')
        reject(new TypeError("commands parameter must be a non-null object."));

      const commandsEntries = Object.entries(commands);

      // TODO/OPTMIZE - 3.4.0 
      if (!commandsEntries.length) {
        console.warn(`No commands provided for handler: ${handler}`);
        return []
      }

      const processedCommands = commandsEntries.map(([name, config]) => {
        const commandInstance = addCommand(handler, { name, ...config });
        return {
          name,
          handler,
          command: { name, ...config },
          pcmd: commandInstance
        };
      });

      resolve(processedCommands)
    })

  }

  async function registerPluginCLI(plugin: IPlugin): Promise<IPlugin> {
    const { handler, commands } = plugin;

    if (typeof handler !== 'string' || handler.trim().length === 0)
      throw new TypeError("Command's 'handler' must be a non-empty string.");

    if (commands === null || typeof commands !== 'object')
      throw new TypeError("command parameter must be a non-null object.");

    if (!handler || !commands)
      throw new Error("Plugin must have handler and commands.");

    const commandValues = Object.values(commands);

    if (!commandValues.length)
      throw new Error(`No commands provided in the plugin: ${handler}`);

    let pcmd: TCommander;

    await registerPluginCommands(handler, commands)
      .then(async commands => {
        return Promise.all(
          commands.map(({ pcmd, command }) =>
            registerCommandOptions(pcmd, command.options)
          )
        );
      });

    return plugin;
  }

  return Object.freeze({
    initializeCLI,
    parseCLI,
    getCommanderCLI,
    addOptions,
    registerCommandOptions,
    addCommand,
    registerPluginCommands,
    registerPluginCLI
  })
}

// Singleton
const CLIAdapter = CreateCLIAdapter();
export default CLIAdapter;