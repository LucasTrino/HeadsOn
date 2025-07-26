// CLIAware.ts
import ICLIAware from './CLIAware.interface.js';

// import getPluginManager from '../pluginManager/pluginManager.js';
import cliInterface from '../../../lib/CLIAdapter/CLIAdapter.js';

import testPlugin from '../../../plugins-system/testPlugin.js';


export function createCLIAware(): ICLIAware {
  // const pluginManager = getPluginManager;

  async function createCliInstance(): Promise<void> {
    const cli = cliInterface;
    const program = cli.getCommanderCLI()

    cli.initializeCLI()
    // TODO/OPTMIZE - 1.0.0 
    try {
      // TODO/OPTMIZE - 3.1.0 
      const pluginHandler = process.argv[2].split(":")[0];
      await cli.registerPluginCLI(testPlugin)
    } catch (error: any) {
      throw new Error(`Failed to register plugin commands: ${error.message}`);
    }

    cli.parseCLI(process.argv)
  }

  async function init(): Promise<void> {
    try {
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