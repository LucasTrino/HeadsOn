// PluginManagerFacade.ts
import IPlugin from "../pluginManager/interfaces/plugin.interface.js";
import IAppCoreContext from "../../coreAppContext.interface.js";

import createMiddleware from "../../../lib/middleware/middleware.js";
import { TMiddleware } from "../../../lib/middleware/middleware.type.js"
import PluginLogger from "./middlewares/loggerMiddleware.chain.js"
import RegisterPlugin from "./middlewares/registerPlugin.chain.js";
import CommandAsserter from "./middlewares/commandAsserter.chain.js";

interface IPluginOrchestrator {
  registerPlugin(Plugin: IPlugin, appContext: IAppCoreContext): Promise<void>;
  getMiddlewareChain(): ReturnType<typeof createMiddleware>;
  init(): void
}

export default PluginOrchestrator;

export function PluginOrchestrator(): IPluginOrchestrator {
  const middleware: ReturnType<typeof createMiddleware> = createMiddleware();

  const logger = PluginLogger().handle;
  const register = RegisterPlugin().handle;
  const commandAsserter = CommandAsserter().handle;

  function setupCoreMiddlewares(): void {
    middleware
      .use(logger as TMiddleware)
      .use(register as TMiddleware)
      .use(commandAsserter as TMiddleware)
  }

  async function registerPlugin(plugin: IPlugin, appContext: IAppCoreContext): Promise<void> {
    // const context = { pluginPath }; 
    const context = { plugin, appContext };
    await middleware.handle(context)
      .then(() => console.log(`Plugin '${plugin.handler}' registrado com sucesso!`))
      .catch(console.error);
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
