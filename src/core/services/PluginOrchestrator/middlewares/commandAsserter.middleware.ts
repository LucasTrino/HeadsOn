import * as MiddlewareType from '../../../../lib/middleware/middleware.type.js';
import IPlugin from '../../pluginManager/interfaces/plugin.interface.js';
import ICoreContext from '../../coreContext/coreContext.interface.js';

import CLIAdapter from '../../../../lib/CLIAdapter/CLIAdapter.js';

export default CommandAsserter;

function CommandAsserter() {
  async function handle(context: { plugin: IPlugin, appContext: ICoreContext }, next: MiddlewareType.TNextFunction): Promise<void> {
    const cli = CLIAdapter;

    const { handler, commands } = context.plugin;

    const commandsEntries = Object.entries(commands);

    if (!commandsEntries.length)
      throw new Error(`No commands provided in the plugin: ${handler}`);

    const results = await Promise.allSettled(commandsEntries.map(([name, config]) =>
      cli.registerCommand({ name, ...config }, context.appContext, handler)
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