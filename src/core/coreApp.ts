// coreApp.ts
import IPluginManager from "./services/pluginManager/pluginManager.interface.js";
import ICoreApp from "./coreApp.interface.js";
import IAppCoreContext from './coreAppContext.interface.js';

import getPluginManager from "./services/pluginManager/pluginManager.js";
import styledLog from "../lib/styledLog/styledLog.js"
import testPlugin from "../plugins-system/testPlugin.js";

export function createCoreApp(): ICoreApp {
  let initialized = false;

  const context: IAppCoreContext = {
    styledLog,
  };

  async function init(): Promise<void> {
    if (initialized) return;

    console.log(context.styledLog.blue('HeadsOn is operating...'));

    const pluginManager: IPluginManager = getPluginManager;
    await pluginManager.registerPlugin(testPlugin, context);

    initialized = true;
  }

  return Object.freeze<ICoreApp>({
    init,
  });
}

// Singleton export
const coreApp = createCoreApp();
export default coreApp;