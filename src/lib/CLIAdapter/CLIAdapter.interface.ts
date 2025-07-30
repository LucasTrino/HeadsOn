import IPlugin from '../../core/services/pluginManager/interfaces/plugin.interface.js';

import TPluginCommands from '../../core/services/pluginManager/types/pluginCommands.type.js';
import TCommander from '../../core/services/pluginManager/types/commander.type.js';
import TPluginOption from '../../core/services/pluginManager/types/pluginOption.type.js';
import TPluginCommand from '../../core/services/pluginManager/types/pluginCommand.type.js';

interface ICLIAdapter {
  initializeCLI(): void;
  parseCLI(argv: string[]): TCommander;
  getCommanderCLI(): TCommander;
  addOptions(command: TCommander, option: TPluginOption): TCommander;
  registerCommandOptions(pcmd: TCommander, options: TPluginOption[]): TCommander;
  addCommand(handler: string, command: TPluginCommand): TCommander;
  registerPluginCommands(handler: string, commands: TPluginCommands): Promise<Array<{
    name: string;
    command: TPluginCommand;
    pcmd: TCommander;
    handler: string;
  }>>;
  registerPluginCLI(plugin: IPlugin): Promise<IPlugin>;
}

export default ICLIAdapter;