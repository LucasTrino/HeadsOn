import IPlugin from "../core/interfaces/plugins/plugin.interface.js"

const testPlugin: IPlugin = {
  name: 'Test Plugin',
  version: '1.0.0',
  description: 'Test Plugin',
  commands: {
    "teste": async () => {
      console.log('Test Plugin execution success!');
    }
  },
  initialize: async (context) => {
    console.log(context.styledLog.yellow("Teste Plugin is also on."))
  },
};

export default testPlugin;