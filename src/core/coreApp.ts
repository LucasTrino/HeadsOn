// Interfaces Imports
import IPluginManager from "./interfaces/plugins/pluginManager.interface.js";
import ICoreApp from "./interfaces/general/coreApp.interface.js";
import IAppCoreContext from './interfaces/appCoreContext.interface.js';
// General Imports
import getPluginManager from "./pluginManager.js";
import styledLog from "../lib/styledLog/styledLog.js"

import testPlugin from "../plugins-system/testPlugin.js";

// coreApp 
export default coreApp

let instance: ICoreApp;
let context: IAppCoreContext;

function coreApp(): ICoreApp {
  if (instance) return instance;

  context = {
    styledLog: styledLog,
  }

  async function init(): Promise<void> {
    console.log(context.styledLog.blue('HeadsOn is operating...'));

    const pluginManager: IPluginManager = getPluginManager();
    await pluginManager.registerPlugin(testPlugin, context);
    
  }

  instance = {
    init: init,
  }

  return instance;
}