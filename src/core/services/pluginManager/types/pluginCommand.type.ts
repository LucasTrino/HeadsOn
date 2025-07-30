import TPluginOption from "./pluginOption.type.js";

export type TPluginCommand = {
  name: string;
  options: TPluginOption[];
  description: string;
  action: (...options: any[]) => Promise<any> | Function;
};

export default TPluginCommand;