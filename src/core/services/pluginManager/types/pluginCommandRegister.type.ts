import TPluginOption from "./pluginOption.type.js";

export type TPluginCommandRegister = {
  name: string;
  options: TPluginOption[];
  description: string;
  action: (...options: any[]) => Promise<any> | Function;
};

export default TPluginCommandRegister;