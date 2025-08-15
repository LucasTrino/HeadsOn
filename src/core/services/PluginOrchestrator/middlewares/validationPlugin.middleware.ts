// const validationMiddleware: PluginMiddleware = async (context, next) => {
//   if (!context.plugin?.isValid()) {
//     console.error(`Plugin inválido: ${context.plugin?.id}`);
//     delete context.plugin; // Impede o registro
//     return;
//   }
//   await next();
// };


import { TNextFunction } from '../../../../lib/middleware/middleware.type.js';
import IPlugin from '../../pluginManager/interfaces/plugin.interface.js';
import IAppCoreContext from '../../../coreAppContext.interface.js';
import getPluginManager from '../../pluginManager/pluginManager.js';

export default ValidatorPlugin;

function ValidatorPlugin() {

  async function handle(
    context: { plugin: IPlugin; appContext: IAppCoreContext },
    next: TNextFunction
  ): Promise<void> {
    const pluginManager = getPluginManager;
    const { plugin } = context;

    try {
      const validationResult = await pluginManager.validatePlugin(plugin);

      if (!validationResult.isValid) {
        const errorMessage = `Plugin validation failed for "${plugin.name}":\n${validationResult.errors.join('\n')}`;
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn(`Plugin validation error: ${error.message}`);
      } else {
        console.warn('Unknown plugin validation error occurred');
      }

      throw error;
    }

    await next();
  }

  return {
    handle,
  };
}