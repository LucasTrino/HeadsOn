// Dependencies Imports
import { Command } from 'commander';
// Interfaces Imports
import ICLIAware from '../interfaces/cli/CLIAware.interface.js';
// General Imports
import getPluginManager from "../pluginManager.js"
import coreApp from '../coreApp.js';

export default CLIAware;

const pluginManager = getPluginManager();

let instance: ICLIAware;

function CLIAware(): ICLIAware {
  if (instance) return instance;

  async function createCliInstance(): Promise<void> {
    const program = new Command();

    program
      .name('HeadsOn')
      .description('CLI para minha aplicação')
      .version('1.0.0');

    // TODO/OPTMIZE - 1.0.0 
    try {
      await pluginManager.registerPluginCommands(program);
    } catch (error: any) {
      throw new Error(`Failed to register plugins commands.`)
    }

    program.parse(process.argv);
  }

  async function init(): Promise<void> {
    try {
      const main = coreApp();
      await main.init()
      await createCliInstance();
    } catch (error: any) {
      console.error('Application failed to start:', error);
      process.exit(1);
    }
  }

  instance = {
    init: init
  }

  return instance
}