type TPluginCommands = {
  [key: string]: {
    options: string[],
    descriptions: string,
    action: (...options: any[]) => Promise<any> | Function;
  }
}
export default TPluginCommands;