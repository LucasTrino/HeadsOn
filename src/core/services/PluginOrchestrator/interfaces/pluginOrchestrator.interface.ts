import IPlugin from "../../pluginManager/interfaces/plugin.interface.js";
import IAppCoreContext from "../../../coreAppContext.interface.js";
import createMiddleware from "../../../../lib/middleware/middleware.js";

export default interface IPluginOrchestrator {
  registerPlugin(Plugin: IPlugin, appContext: IAppCoreContext): Promise<void>;
  getMiddlewareChain(): ReturnType<typeof createMiddleware>;
  init(): void
}