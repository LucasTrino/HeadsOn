import IPlugin from "../../pluginManager/interfaces/plugin.interface.js";
import IValidationResult from "../../pluginManager/interfaces/validationResult.interface.js";

export default interface IPluginValidation {
  validatePluginMetadatas: (
    plugin: IPlugin,
    validationProperties: Array<{
      name: string;
      validation?: Function;
      required: boolean;
      type: string;
    }>
  ) => IValidationResult;

  validatePluginsInitializationFunction: (
    plugin: IPlugin
  ) => IValidationResult;

  validatePluginCommands: (
    plugin: IPlugin
  ) => IValidationResult;
}