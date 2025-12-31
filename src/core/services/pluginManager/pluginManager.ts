// pluginManager.ts
import IPlugin from "./interfaces/plugin.interface.js";
import TPluginCommand from "./types/pluginCommand.type.js";
import TPluginOption from "./types/pluginOption.type.js";
import IPluginManager from "./pluginManager.interface.js";
import ICoreContext from "../coreContext/coreContext.interface.js";
import IPluginsList from "./interfaces/pluginList.interface.js";

import metadataValidationProperties from './metadataValidationProperties.js'

interface IValidationResult {
  isValid: boolean;
  errors: string[];
}

export function createPluginManager(): IPluginManager {
  const pluginRegistry = new Map<string, IPlugin>();

  // TODO/OPTMIZE - 4.0.0

  function validatePluginMetadatas(plugin: IPlugin, validationProperties: Array<{ name: string, validation?: Function, required: boolean, type: string, errorMessage: string }>): IValidationResult {
    const errors: string[] = [];

    for (let i = 0; i < validationProperties.length; i++) {
      const property = validationProperties[i]
      const name = property.name as keyof IPlugin;

      if (typeof plugin[name] === 'undefined' || plugin[name] === null) {
        if (property.required) {
          errors.push(property.errorMessage);
          continue;
        }
      } else if (property.type = "non-empty-string") {
        if (typeof plugin[name] !== 'string' || plugin[name].trim().length === 0) {
          errors.push(property.errorMessage);
          continue;
        } else if (property.validation) {
          if (!(property.validation(plugin[name]))) {
            errors.push(property.errorMessage);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  function validatePluginsInitializationFunction(plugin: IPlugin): IValidationResult {
    let errors: string[] = [];

    if (typeof plugin.initialize === 'undefined' || plugin.initialize === null) {
      errors.push('plugin has to have a initialize function');
    }

    if (typeof plugin.initialize !== 'function' ||
      (typeof plugin.initialize === 'object' &&
        typeof (plugin.initialize as PromiseLike<unknown>).then !== 'function')) {
      errors.push('The initialize function has to be a function or a promise');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  function isValidOptionString(option: string): boolean {
    const trimmedStr = option.trim();
    const pattern = RegExp(/^(-[a-zA-Z],\s+)?--[a-zA-Z][a-zA-Z-]*\s+<[^>\s]+>$/)
    return pattern.test(trimmedStr)
  }

  function isValidateOptionObject(option: TPluginOption, index: number): IValidationResult {
    let errors: string[] = [];


    if (typeof option === 'object') {
      if (typeof option.flags === 'undefined' || option.flags === null) {
        errors.push("option object at index " + index + " must have 'flags' property");
      } else if (typeof option.flags === "string" && option.flags.trim().length === 0) {
        errors.push("'flags' property at index " + index + " must be a non-empty string");
      }


      if (typeof option.description === 'undefined' || option.description === null) {
        errors.push("option object at index " + index + " must have 'description' property");
      } else if (typeof option.description === "string" && option.description.trim().length === 0) {
        errors.push("'description' property at index " + index + " must be a non-empty string");
      }

      if (typeof option.defaultValue !== 'undefined' && option.defaultValue !== null) {
        if (typeof option.defaultValue === "string" && option.defaultValue.trim().length === 0) {
          errors.push("'defaultValue' property at index " + index + " must be a non-empty string");
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  function validatePluginCommandsOptions(options: TPluginOption[]): IValidationResult {
    let errors: string[] = [];

    if (typeof options === 'undefined' || options === null) {
      errors.push("options property is required")
      return { isValid: false, errors }
    }

    if (!Array.isArray(options)) {
      errors.push("options must be an array")
      return { isValid: false, errors }

    }

    if (options.length === 0) {
      errors.push("options array cannot be empty");
      return { isValid: false, errors };
    }

    for (let i = 0; options.length > i; i++) {
      const option = options[i];

      if (typeof option === 'undefined' || option === null) {
        errors.push("option at index " + i + " is null or undefined");
        continue;
      }

      if (typeof option === 'string') {
        if (option.trim().length === 0)
          errors.push("string option at index " + i + " cannot be empty");

        const isOptionStringValid = isValidOptionString(option);

        if (!isOptionStringValid)
          errors.push("option at index " + i + " has invalid format. Expected: '--flag <type>' or '-s, --flag <type>'");

      } else if (typeof option === 'object' && !Array.isArray(option)) {
        const validation = isValidateOptionObject(option, i);

        if (!validation.isValid) {
          errors = [...validation.errors];
        }
      } else {
        errors.push("option at index " + i + " must be either a string or an object");
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  function validatePluginCommandsValues(command: TPluginCommand): IValidationResult {
    let errors: string[] = [];

    const optionsValidation = validatePluginCommandsOptions(command.options);

    if (!optionsValidation.isValid)
      errors = [...optionsValidation.errors];

    if (typeof command.description !== 'undefined' || command.description !== null) {
      if (typeof command.description !== 'string' || command.description.trim().length === 0)
        errors.push('description property must to be a string');
    } else {
      errors.push('command has to have a description property');
    }

    if (typeof command.action !== 'undefined' && command.action !== null) {
      if (typeof command.action !== 'function' || (typeof command.action === 'object' && typeof (command.action as PromiseLike<unknown>).then !== 'function')) {
        errors.push('action property must to be a function or a promise');
      }
    } else {
      errors.push('command has to have at least one action');
    }

    return {
      isValid: errors.length === 0,
      errors
    };

  }

  function validatePluginCommands(plugin: IPlugin): IValidationResult {
    let errors: string[] = [];

    if (typeof plugin.commands === 'undefined' || plugin.commands === null) {
      errors.push("The commands property is required");
      return { isValid: false, errors };
    }

    if (typeof plugin.commands !== 'object') {
      errors.push('The commands property has to be a object');
      return { isValid: false, errors };
    }

    if (Object.keys(plugin.commands).length < 1) {
      errors.push('The commands property has to have at least one command');
    } else {
      for (let i = 0; Object.keys(plugin.commands).length > i; i++) {
        const key = Object.keys(plugin.commands)[i];
        const element = plugin.commands[key];

        if (typeof element !== 'object') {
          errors.push('commands values has to be a object');
          continue;
        } else if (!validatePluginCommandsValues(element).isValid) {
          errors = [...validatePluginCommandsValues(element).errors];
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async function validatePlugin(plugin: IPlugin): Promise<{ isValid: boolean, errors: string[] }> {
    // TODO/OPTMIZE - 1.1.0
    let errors: string[] = [];

    const metadaValidation = validatePluginMetadatas(plugin, metadataValidationProperties);
    const initializeFunctionValidation = validatePluginsInitializationFunction(plugin);
    const commandsValidation = validatePluginCommands(plugin)

    if (!metadaValidation.isValid)
      errors = [...metadaValidation.errors];

    if (!initializeFunctionValidation.isValid)
      errors = [...metadaValidation.errors];

    if (!commandsValidation.isValid)
      errors = [...commandsValidation.errors]

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async function register(plugin: IPlugin, context: ICoreContext): Promise<void> {
    if (pluginRegistry.has(plugin.name)) return;

    try {
      await plugin.initialize(context);
    } catch (err: any) {
      throw new Error(`Failed to initialize plugin "${plugin.name}": ${err.message}`);
    }

    pluginRegistry.set(plugin.handler, plugin);
  }

  // TODO/OPTMIZE - 3.8.4
  function getPluginCommands(pluginName: string): { name: string; details: any }[] {
    const plugin = pluginRegistry.get(pluginName);
    if (!plugin) return [];

    return Object.entries(plugin.commands).map(([name, details]) => ({
      name,
      details,
    }));
  }

  // TODO/QUESTION - 1.3.0
  function getAllPlugins(): IPlugin[] {
    return Array.from(pluginRegistry.values());
  }

  function getSinglePlugin(name: string): IPlugin | undefined {
    return pluginRegistry.has(name) ?
      pluginRegistry.get(name) :
      undefined;
  }

  // TODO/OPTIMIZE - 3.2.0
  function listPlugins(): IPluginsList[] {
    return getAllPlugins().map(plugin => ({
      name: plugin.name,
      version: plugin.version,
      description: plugin.description ?? '',
    }));
  }

  return Object.freeze<IPluginManager>({
    validatePlugin,
    registerPlugin: register,
    getAllPlugins,
    getSinglePlugin,
    getPluginsCommands: getPluginCommands,
    listPlugins
  });
}

// Singleton
const pluginManager = createPluginManager();
export default pluginManager;
