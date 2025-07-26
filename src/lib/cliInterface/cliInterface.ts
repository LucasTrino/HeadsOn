// cliInterface.ts
import { Command } from 'commander';

import TPluginCommand from '../../core/services/pluginManager/types/pluginCommand.type.js';

import TCommander from '../../core/services/pluginManager/types/commander.type.js';
import TPluginOptions from '../../core/services/pluginManager/types/pluginOptions.type.js';
import IPlugin from '../../core/services/pluginManager/interfaces/plugin.interface.js';
import TPluginCommands from '../../core/services/pluginManager/types/pluginCommands.type.js';

function CLIInterface() {
  const program = new Command();
  let commands: TPluginCommand[] = []

  function initializeCLI() {
    program
      .name('HeadsOn')
      .description('CLI para minha aplicação')
      .version('1.0.0');
  }

  function parseCLI(argv: string[]) {
    return program.parse(argv);
  }

  function getCommanderCLI(): TCommander {
    return program;
  }

  function addCommand(command: TPluginCommand): void {
    commands.push(command)
  }

  function registerCommand(pluginHandler: string, command: TPluginCommand): void {
    const { name } = command;

    const cmd = program.command(`${pluginHandler}:${name}`);
    cmd.description(command.description);

    cmd.action(async (name: string, options: string[] | TPluginOptions[]) => {
      const commandAction = command.action;
      await commandAction(name, options);
    });

  }

  function applyOptionToCommand(
    command: TCommander,
    option: string | TPluginOptions
  ): TCommander {

    typeof option === 'string' ?
      command.option(option) :
      option.flags && command.option(option.flags, option.description, option.defaultValue);

    return command;
  }

  function registerPluginCommands(pluginHandler: string, commands: TPluginCommands): void {
    const commandsValues = Object.entries(commands);

    for (const [key, details] of commandsValues) {
      registerCommand(pluginHandler, { name: key, ...details });
    }

  }

  async function registerPluginCLI(plugin: IPlugin): Promise<void> {
    const {
      handler,
      commands,
    } = plugin;

    const commandsValues = Object.entries(commands);

    for (const [key, config] of commandsValues) {
      const cmd = program.command(`${handler}:${key}`);

      if (typeof config.description !== null) cmd.description(config.description)

      if (typeof config.options !== null) {
        config.options.forEach((option: string | TPluginOptions) => {
          typeof option !== 'string' ?
            cmd.option(option.flags, option.description, option.defaultValue)
            : cmd.option(option)
        })
      }

      cmd.action(async (name: string, options: string[] | TPluginOptions[]) => {
        await config.action(name, options);
      })

    }

  }

  return {
    initializeCLI,
    parseCLI,
    getCommanderCLI,
    registerPluginCommands,
    registerPluginCLI
  }
}

export default CLIInterface();