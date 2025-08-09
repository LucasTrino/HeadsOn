import * as MiddlewareType from '../../../../lib/middleware/middleware.type.js';
import IPlugin from '../../pluginManager/interfaces/plugin.interface.js';
import IAppCoreContext from '../../../coreAppContext.interface.js';

import CLIAdapter from '../../../../lib/CLIAdapter/CLIAdapter.js';

export default CommandAsserter;

function CommandAsserter() {
  async function handle(context: { plugin: IPlugin, appContext: IAppCoreContext }, next: MiddlewareType.TNextFunction): Promise<void> {
    const cli = CLIAdapter;

    const { handler, commands } = context.plugin;

    if (typeof handler !== 'string' || handler.trim().length === 0)
      throw new TypeError("Command's 'handler' must be a non-empty string.");

    if (!handler || !commands)
      throw new Error("Plugin must have handler and commands.");

    const commandsEntries = Object.entries(commands);

    if (!commandsEntries.length)
      throw new Error(`No commands provided in the plugin: ${handler}`);

    const results = await Promise.allSettled(commandsEntries.map(([name, config]) =>
      cli.registerCommand({ name, ...config }, handler)
    ));

    for (const result of results) {
      if (result.status === 'rejected') {
        console.warn(`Failed to register plugin commands for ${handler}:`, result.reason);
      }
    }

    await next();
  }

  return {
    handle
  }
}