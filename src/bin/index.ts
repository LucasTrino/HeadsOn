#!/usr/bin/env node
import CLIAware from "../core/services/CLIAware/CLIAware.js";
import coreApp from "../core/coreApp.js";

import IAppCoreContext from "../core/coreAppContext.interface.js";

import styledLog from "../lib/styledLog/styledLog.js"

const context: IAppCoreContext = {
  styledLog,
};

async function main() {
  try {
    await coreApp.init();
    await CLIAware.init(context);
  } catch (error) {
    console.error('Application - failed to start:', error);
    process.exit(1);
  }
}

main()