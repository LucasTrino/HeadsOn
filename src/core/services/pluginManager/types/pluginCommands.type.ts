import TPluginOption from "./pluginOption.type.js";

type TPluginCommands = {
  [key: string]: {
    options: TPluginOption[],
    description: string,
    action: (options: { [key: string]: boolean }, command: any) => Promise<any> | Function;
  }
}

export default TPluginCommands;