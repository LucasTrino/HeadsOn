import TPluginCommand from "../../../core/services/pluginManager/types/pluginCommand.type.js"
import TCommander from "../../../core/services/pluginManager/types/commander.type.js"

type TCommandContext = {
  commandKey: string, command: TPluginCommand, cmdInstance: TCommander
}

export default TCommandContext