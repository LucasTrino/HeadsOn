import IPlugin from '../../core/services/pluginManager/interfaces/plugin.interface.js';

import TPluginCommands from '../../core/services/pluginManager/types/pluginCommands.type.js';
import TCommander from '../../core/services/pluginManager/types/commander.type.js';
import TPluginOption from '../../core/services/pluginManager/types/pluginOption.type.js';
import TPluginCommand from '../../core/services/pluginManager/types/pluginCommand.type.js';
import TCommandContext from './types/commandContext.type.js';

interface ICLIAdapter {
  initialize(): TCommander;
  parse(argv: string[]): TCommander;
  getCommander(): TCommander;
  getCommand(commandKey: string): TCommandContext | undefined;
  applyOptionToCommand(cmdInstance: TCommander,
    option: TPluginOption
  ): TCommander;
  registerOptions(cmdInstance: TCommander, options: TPluginOption[]): Promise<TCommander>;
  registerCommand(command: TPluginCommand, handler?: string): Promise<TCommandContext>;
  registerPlugin(plugin: IPlugin): Promise<IPlugin>;
}

export default ICLIAdapter;