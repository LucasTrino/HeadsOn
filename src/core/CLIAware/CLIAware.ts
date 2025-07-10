// Dependencies Imports
import { Command } from 'commander';
// Interfaces Imports
import ICLIAware from '../interfaces/cli/CLIAware.interface.js';
// General Imports
import getPluginManager from "../pluginManager.js"
import coreApp from '../coreApp.js';

export default CLIAware;

let instance: ICLIAware;

function CLIAware(): ICLIAware {
  if (instance) return instance;
  //TODO: Remover any
  async function registerPluginCommands(program: any): Promise<void> {
    const pluginManager = getPluginManager();

    const pluginsList = Array.from(pluginManager.commands.entries());

    for (let index = 0; index < pluginsList.length; index++) {
      const plugin = pluginsList[index][0];

      program.command(`${plugin}`)
        .description(``)
        .action(async (options: string[]) => {
          const commandFn = pluginManager.commands.get(plugin);
          if (typeof commandFn === 'function') {
            await commandFn();
          } else {
            console.warn(`Command for plugin "${plugin}" is not defined.`);
          }
        });
    }
  }

  async function init(): Promise<any> {
    const program = new Command();

    program
      .name('HeadsOn')
      .description('CLI para minha aplicação')
      .version('1.0.0');

    try {
      const main = coreApp();
      await main.init()
    } catch (error: any) {
      console.error('Application failed to start:', error);
      process.exit(1);
    }

    try {
      await registerPluginCommands(program);
    } catch (error: any) {
      throw new Error(`Failed to register plugins commands.`)
    }

    program.parse(process.argv);
  }

  instance = {
    registerPluginCommands: registerPluginCommands,
    init: init
  }

  return instance
}