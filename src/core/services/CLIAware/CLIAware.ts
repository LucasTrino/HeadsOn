// TODO/OPTMIZE - 3.8.0
// CLIAware.ts
import ICLIAware from './CLIAware.interface.js';
import IPluginManager from '../pluginManager/pluginManager.interface.js';

import cliAdapter from '../../../lib/CLIAdapter/CLIAdapter.js';

import getPluginManager from '../pluginManager/pluginManager.js';
import testPlugin from '../../../plugins-system/testPlugin.js';

export function createCLIAware(): ICLIAware {
  const pluginManager: IPluginManager = getPluginManager;

  async function createCliInstance(context: {}): Promise<void> {

    await pluginManager.registerPlugin(testPlugin, context);
    const cli = cliAdapter;

    cli.initialize();

    // TODO/OPTMIZE - 1.0.0 
    try {
      // TODO/OPTMIZE - 3.1.0 
      const pluginHandler = process.argv[2].split(":")[0];
      const pluginInstance = pluginManager.getSinglePlugin(pluginHandler);

      if (pluginInstance) {
        await cli.registerPlugin(pluginInstance);
      } else {
        throw Error(`Plugin ${pluginHandler} not found.`)
      }
      
    } catch (error: any) {
      throw new Error(`Failed to register plugin commands: ${error.message}`);
    }

    cli.parse(process.argv)
  }

  async function init(context: {}): Promise<void> {
    try {
      await createCliInstance(context);
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