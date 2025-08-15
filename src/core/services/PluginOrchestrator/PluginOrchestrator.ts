// PluginManagerFacade.ts
import IPlugin from "../pluginManager/interfaces/plugin.interface.js";
import IAppCoreContext from "../../coreAppContext.interface.js";
import IPluginOrchestrator from "./interfaces/pluginOrchestrator.interface.js"

import createMiddleware from "../../../lib/middleware/middleware.js";
import { TMiddleware } from "../../../lib/middleware/middleware.type.js"

import onError from "./services/onError.js";

import PluginLogger from "./middlewares/logger.middleware.js"
import ValidatorPlugin from "./middlewares/validationPlugin.middleware.js";
import RegisterPlugin from "./middlewares/registerPlugin.middleware.js";
import CommandAsserter from "./middlewares/commandAsserter.middleware.js";

export default PluginOrchestrator;

export function PluginOrchestrator(): IPluginOrchestrator {
  const middleware: ReturnType<typeof createMiddleware> = createMiddleware();

  const logger = PluginLogger().handle;
  const validator = ValidatorPlugin().handle;
  const register = RegisterPlugin().handle;
  const commandAsserter = CommandAsserter().handle;

  function setupCoreMiddlewares(): void {
    middleware
      .use(validator as TMiddleware)
      .use(logger as TMiddleware)
      .use(register as TMiddleware)
      .use(commandAsserter as TMiddleware)
  }

  async function registerPlugin(plugin: IPlugin, appContext: IAppCoreContext): Promise<void> {
    // const context = { pluginPath }; 
    const context = { plugin, appContext };
    await middleware.handle(context, onError).catch(error => { throw error })
  }

  function getMiddlewareChain(): ReturnType<typeof createMiddleware> {
    return middleware;
  }

  function init(): void {
    setupCoreMiddlewares()
  }

  return {
    registerPlugin,
    getMiddlewareChain,
    init
  }
}
