import { TNextFunction } from '../../../../lib/middleware/middleware.type.js';

import ICoreContext from '../../coreContext/coreContext.interface.js';
import IPlugin from '../../pluginManager/interfaces/plugin.interface.js';

export default PluginImporter;

function PluginImporter() {

  async function handle(
    context: {
      plugin: string | IPlugin; appContext: ICoreContext
    },
    next: TNextFunction
  ): Promise<void> {
    try {
      const { handlerMap } = await import('../../../../plugins-system/handler-map.js');

      const { plugin } = context;

      const pluginKey = plugin as keyof typeof handlerMap;
      const pluginToLoad = handlerMap[pluginKey];

      context.plugin = { ...pluginToLoad };

    } catch (error) {
      throw new Error(`Handler ${(context.plugin as any).handler} not found`);
    }

    await next();
  }

  return {
    handle,
  };
}