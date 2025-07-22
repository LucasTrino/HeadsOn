export type TPluginCommand = {
  name: string;
  options: string[];
  descriptions: string;
  action: (...options: any[]) => Promise<any> | Function;
};

export default TPluginCommand;