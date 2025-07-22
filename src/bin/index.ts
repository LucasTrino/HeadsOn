#!/usr/bin/env node
import CLIAware from "../core/services/CLIAware/CLIAware.js";
import coreApp from "../core/coreApp.js";

async function main() {
  try {
    const CLI = CLIAware;
    await coreApp.init();
    await CLI.init();
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
}

main()