// Interfaces Imports
import IPluginManager from "./interfaces/plugins/pluginManager.interface.js";
import ISingletonInstance from "./interfaces/general/singletonInstance.interface.js";
import IAppCoreContext from './interfaces/appCoreContext.interface.js';
// General Imports
import getPluginManager from "./pluginManager.js";
import styledLog from "../lib/styledLog/styledLog.js"

import testPlugin from "../plugins-system/testPlugin.js";


// coreApp 

export default coreApp

let instance: ISingletonInstance;

async function coreApp(): Promise<ISingletonInstance> {

  if (instance) return instance;

  const context: IAppCoreContext = {
    styledLog: styledLog,
  }

  const init = async () => {
    console.log(context.styledLog.blue('HeadsOn is operating...'));

    const pluginManager: IPluginManager = getPluginManager(context);

    await pluginManager.registerPlugin(testPlugin);

    const testPluginInstance = pluginManager.commands.get("teste");

    if (testPluginInstance) await testPluginInstance();

    pluginManager.listPlugins().forEach(item => console.log(item));
  }

  instance = {
    init: init,
  }

  return instance;
}