// coreApp.ts
import IPluginManager from "./library/pluginManager/pluginManager.interface.js";
import ICoreApp from "./coreApp.interface.js";
import IAppCoreContext from './coreAppContext.interface.js';

import getPluginManager from "./library/pluginManager/pluginManager.js";
import styledLog from "../library/styledLog/styledLog.js"
import testPlugin from "../plugins-system/testPlugin.js";

export function createCoreApp(): ICoreApp {
  let initialized = false;

  // TODO/OPTIMIZE - 3.0.0
  const context: IAppCoreContext = {
    styledLog,
  };

  async function init(): Promise<void> {
    if (initialized) return;

    const pluginManager: IPluginManager = getPluginManager;
    await pluginManager.registerPlugin(testPlugin, context);

    console.log(context.styledLog.blue('HeadsOn is operating...'));

    initialized = true;
  }

  return Object.freeze<ICoreApp>({
    init,
  });
}

// Singleton export
const coreApp = createCoreApp();
export default coreApp;