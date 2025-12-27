import IPlugin from "../../pluginManager/interfaces/plugin.interface.js";
import ICoreContext from "../../coreContext/coreContext.interface.js";
import createMiddleware from "../../../../lib/middleware/middleware.js";

export default interface IPluginOrchestrator {
  registerPlugin(Plugin: string, appContext: ICoreContext): Promise<void>;
  getMiddlewareChain(): ReturnType<typeof createMiddleware>;
  init(): void
}