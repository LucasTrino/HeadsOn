// create the CLIAware interface
interface ICLIAware {
  registerPluginCommands: (program: any) => Promise<void>,
  init: () => Promise<void>
}

export default ICLIAware 