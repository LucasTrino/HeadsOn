import * as MiddlewareType from '../../../../lib/middleware/middleware.type.js';
import IPlugin from '../../pluginManager/interfaces/plugin.interface.js';
import IAppCoreContext from '../../../coreAppContext.interface.js';

export default PluginLogger;

function PluginLogger() {
  async function handle(context: { plugin: IPlugin, appContext: IAppCoreContext }, next: MiddlewareType.TNextFunction): Promise<void> {
    console.log('Registrando plugin:', context.plugin.handler);

    await next();
  }

  return {
    handle
  }
}