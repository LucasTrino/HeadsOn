import IPlugin from "../core/services/pluginManager/interfaces/plugin.interface.js"

const testPlugin: IPlugin = {
  name: 'Test Plugin',
  version: '1.0.0',
  description: 'Test Plugin',
  handler: "testPlugin",
  commands: {
    teste: {
      options: [
        { flags: '-o, --ola', description: 'console "Olá"' },
        { flags: '-t, --tchau', description: 'console "Tchau"' },
      ],
      description: 'console a test message.',
      action: async (options: { [key: string]: boolean }) => {
        // TODO/OPTMIZE - 1.8.0
        if (options.ola) {
          console.log(`Test Plugin execution success with "Olá"!`);
        }
        if (options.tchau) {
          console.log(`Test Plugin execution success with "Tchau"!`);
        }
        console.log(`Test Plugin execution success!`);
      }
    }
  },

  initialize: async (context) => {
    console.log(context.styledLog.yellow("Teste Plugin is also on."))
  },

};

export default testPlugin;