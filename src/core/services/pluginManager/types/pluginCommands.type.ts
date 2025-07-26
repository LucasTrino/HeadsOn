import { TPluginOptions } from "./pluginOptions.type.js";

type TPluginCommands = {
  [key: string]: {
    options: TPluginOptions[] | string[],
    description: string,
    action: (...options: any[]) => Promise<any> | Function;
  }
}
export default TPluginCommands;