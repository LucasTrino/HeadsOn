import TPluginOptions from "./pluginOptions.type.js";

export type TPluginCommand = {
  name: string;
  options: TPluginOptions[] | string[];
  description: string;
  action: (...options: any[]) => Promise<any> | Function;
};

export default TPluginCommand;