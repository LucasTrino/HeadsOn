// TODO/OPTMIZE - 3.8.0
// coreApp.ts
import ICoreApp from "./coreApp.interface.js";

export function createCoreApp(): ICoreApp {
  let initialized = false;

  // TODO/OPTIMIZE - 3.0.0
  async function init(): Promise<void> {
    if (initialized) return;

    initialized = true;
  }

  return Object.freeze<ICoreApp>({
    init,
  });
}

// Singleton export
const coreApp = createCoreApp();
export default coreApp;