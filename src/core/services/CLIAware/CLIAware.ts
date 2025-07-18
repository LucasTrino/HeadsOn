// CLIAware.ts
// Dependencies
import { Command } from 'commander';
// Interfaces
import ICLIAware from './CLIAware.interface.js';
// Core & Plugins
import getPluginManager from '../pluginManager/pluginManager.js';
import coreApp from '../../coreApp.js';

export function createCLIAware(): ICLIAware {
  const pluginManager = getPluginManager;

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
      throw new Error(`Failed to register plugin commands: ${error.message}`);
    }

    program.parse(process.argv);
  }

  async function init(): Promise<void> {
    try {
      await coreApp.init();
      await createCliInstance();
    } catch (error: any) {
      console.error('Application failed to start:', error);
      process.exit(1);
    }
  }

  return Object.freeze<ICLIAware>({
    init,
  });
}

// Singleton
const CLIAware = createCLIAware();
export default CLIAware;