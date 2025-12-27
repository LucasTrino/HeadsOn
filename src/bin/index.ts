#!/usr/bin/env node
import CLIAware from "../core/services/CLIAware/CLIAware.js";
import coreApp from "../core/coreApp.js";
import { coreContext } from "../core/services/coreContext/coreContext.js"

async function main() {
  try {
    const main = coreApp;
    await main.init()
    
    await CLIAware.init(coreContext);
  } catch (error) {
    console.error('Application - failed to start:', error);
    process.exit(1);
  }
}

main();