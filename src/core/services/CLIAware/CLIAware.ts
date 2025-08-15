// TODO/OPTMIZE - 3.8.0
// CLIAware.ts
import ICLIAware from './CLIAware.interface.js';
import IPluginOrchestrator from '../PluginOrchestrator/interfaces/pluginOrchestrator.interface.js';

import cliAdapter from '../../../lib/CLIAdapter/CLIAdapter.js';

import PluginOrchestrator from '../PluginOrchestrator/PluginOrchestrator.js';
import testPlugin from '../../../plugins-system/index.js';

export function createCLIAware(): ICLIAware {

  // TODO/OPTMIZE - 3.8.1 
  async function createCliInstance(context: {}): Promise<void> {

    const cli = cliAdapter;

    cli.initialize();

    // TODO/OPTMIZE - 1.0.0 
    try {
      // TODO/OPTMIZE - 3.1.0 
      const pluginHandler = process.argv[2].split(":")[0];

      const pluginOrchestrator: IPluginOrchestrator = PluginOrchestrator();
      pluginOrchestrator.init()

      await pluginOrchestrator.registerPlugin(testPlugin, context);

    } catch (error: any) {
      throw new Error(`Failed to register plugin commands: ${error.message}`);
    }

    cli.parse(process.argv)
  }

  // TODO/OPTMIZE - 3.8.1 
  async function init(context: {}): Promise<void> {
    try {
      await createCliInstance(context);
    } catch (error: any) {
      throw error;
    }
  }

  return Object.freeze<ICLIAware>({
    init,
  });
}

// Singleton
const CLIAware = createCLIAware();
export default CLIAware;