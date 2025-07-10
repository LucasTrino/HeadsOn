import coreApp from "../src/core/coreApp.js"

try {
  const main = coreApp();
  await main.init()
} catch (error: any) {
  console.error('Application failed to start:', error);
  process.exit(1);
}