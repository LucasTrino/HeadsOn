import * as MiddlewareType from '../../../../lib/middleware/middleware.type.js';
import IPlugin from '../../pluginManager/interfaces/plugin.interface.js';
import IAppCoreContext from '../../../coreAppContext.interface.js';
import getPluginManager from '../../pluginManager/pluginManager.js';

export default RegisterPlugin;

function RegisterPlugin() {
  async function handle(context: { plugin: IPlugin, appContext: IAppCoreContext }, next: MiddlewareType.TNextFunction): Promise<void> {
    const pluginManager = getPluginManager;
    const { plugin, appContext } = context;

    await pluginManager.registerPlugin(plugin, appContext);

    await next();
  }

  return {
    handle
  }
}