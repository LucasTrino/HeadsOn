import IPlugin from "../core/interfaces/plugins/plugin.interface.js"

const testPlugin: IPlugin = {
  name: 'Test Plugin',
  version: '1.0.0',
  description: 'Test Plugin',
  commands: {
    "teste": async (...options) => {

      //TODO(before-commit): Teste do parser das options de comando (!Apagar antes do commit)

      if (options.includes('--olá')) {
        console.log(`Test Plugin execution success with "Olá"!`);
      }

      if (options.includes('--tchau')) {
        console.log(`Test Plugin execution success with "Tchau"!`);
      }
      
      console.log(`Test Plugin execution success!`);

    }
  },
  initialize: async (context) => {
    console.log(context.styledLog.yellow("Teste Plugin is also on."))
  },
};

export default testPlugin;