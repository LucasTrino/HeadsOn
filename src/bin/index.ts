#!/usr/bin/env node
import CLIAware from "../core/CLIAware/CLIAware.js";

async function main() {
  try {
    const CLI = CLIAware();
    await CLI.init();
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
}

main()