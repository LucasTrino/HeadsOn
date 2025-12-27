import IPlugin from "../../core/services/pluginManager/interfaces/plugin.interface.js"

const testPlugin: IPlugin = {
  name: 'Test Plugin',
  version: '1.0.0',
  description: 'Test Plugin',
  handler: "testPlugin",
  commands: {
    teste: {
      options: [
        { flags: '-g, --greeting <greet>', description: 'console greeting', defaultValue: 'Tchau' },
      ],
      description: 'console a test message.',
      action: async (options: { [key: string]: boolean }, command) => {
        console.log(`Test Plugin execution success!`);
        
        // TODO/OPTMIZE - 1.8.0
        if (options.greeting) {
          console.log(command.coreContext.styledLog.blue(`Test Plugin execution success with greeting option ${options.greeting}`));
        }
      }
    }
  },

  initialize: async (context) => {
    console.log(context.styledLog.yellow("Teste Plugin is on."))
  },

};

export default testPlugin;