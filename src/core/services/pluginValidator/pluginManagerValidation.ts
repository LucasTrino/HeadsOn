import TPluginCommand from "../pluginManager/types/pluginCommand.type.js";
import TPluginOption from "../pluginManager/types/pluginOption.type.js";
import IPlugin from "../pluginManager/interfaces/plugin.interface.js";
import IValidationResult from "../pluginManager/interfaces/validationResult.interface.js"
import IPluginValidation from "./interfaces/pluginValidation.interface.js";

import ValidationErrors from "./errors/validationErrors.js";
import ctxError from "./errors/contextErrors.js";

export default function createPluginValidation(): IPluginValidation {

  // TODO/OPTMIZE - 4.0.0

  function isValidOptionString(option: string): boolean {
    const trimmedStr = option.trim();
    const pattern = RegExp(/^(-[a-zA-Z],\s+)?--[a-zA-Z][a-zA-Z-]*\s+<[^>\s]+>$/)
    return pattern.test(trimmedStr)
  }

  function isValidateOptionObject(option: TPluginOption, index: number): IValidationResult {
    let errors: string[] = [];


    if (typeof option === 'object') {
      if (typeof option.flags === 'undefined' || option.flags === null) {
        errors.push(
          ValidationErrors.required(`options[${index}].flags`)
        );
      } else if (typeof option.flags === "string" && option.flags.trim().length === 0) {
        errors.push(
          ValidationErrors.nonEmptyString(`options[${index}].flags`)
        );
      }


      if (typeof option.description === 'undefined' || option.description === null) {
        errors.push(
          ValidationErrors.required(`options[${index}].description`)
        );
      } else if (typeof option.description === "string" && option.description.trim().length === 0) {
        errors.push(
          ValidationErrors.nonEmptyString(`options[${index}].description`)
        );
      }

      if (typeof option.defaultValue !== 'undefined' && option.defaultValue !== null) {
        if (typeof option.defaultValue === "string" && option.defaultValue.trim().length === 0) {
          errors.push(
            ValidationErrors.nonEmptyString(`options[${index}].defaultValue`)
          );
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  function validatePluginMetadatas(plugin: IPlugin, validationProperties: Array<{ name: string, validation?: Function, required: boolean, type: string }>): IValidationResult {
    const errors: string[] = [];

    for (let i = 0; i < validationProperties.length; i++) {
      const property = validationProperties[i]
      const name = property.name as keyof IPlugin;

      if (typeof plugin[name] === 'undefined' || plugin[name] === null) {
        if (property.required) {
          errors.push(ValidationErrors.required(name));
          continue;
        }
      } else if (property.type === "non-empty-string") {
        if (typeof plugin[name] !== 'string' || plugin[name].trim().length === 0) {
          errors.push(ValidationErrors.invalidType(name, property.type));
          continue;
        } else if (property.validation) {
          if (!(property.validation(plugin[name]))) {
            errors.push(ValidationErrors.invalidFormat(name, '0.0.0'));

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
      errors.push(ValidationErrors.required(ctxError.initialize));
    }

    if (typeof plugin.initialize !== 'function' ||
      (typeof plugin.initialize === 'object' &&
        typeof (plugin.initialize as PromiseLike<unknown>).then !== 'function')) {
      errors.push(
        ValidationErrors.invalidType(ctxError.initialize, 'function or promise')
      );

    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }



  function validatePluginCommandsOptions(options: TPluginOption[]): IValidationResult {
    let errors: string[] = [];

    if (typeof options === 'undefined' || options === null) {
      errors.push(
        ValidationErrors.required('options')
      );
      return { isValid: false, errors }
    }

    if (!Array.isArray(options)) {
      errors.push(
        ValidationErrors.mustBeArray('options')
      );
      return { isValid: false, errors }

    }

    if (options.length === 0) {
      errors.push(
        ValidationErrors.cannotBeEmpty('options')
      );
      return { isValid: false, errors };
    }

    for (let i = 0; options.length > i; i++) {
      const option = options[i];

      if (typeof option === 'undefined' || option === null) {
        errors.push(
          ValidationErrors.required(`options[${i}]`)
        );
        continue;
      }

      if (typeof option === 'string') {
        if (option.trim().length === 0)
          errors.push(
            ValidationErrors.nonEmptyString(`options[${i}]`)
          );

        const isOptionStringValid = isValidOptionString(option);

        if (!isOptionStringValid)
          errors.push(
            ValidationErrors.invalidFormat(
              `options[${i}]`,
              "'--flag <type>' or '-s, --flag <type>'"
            )
          );

      } else if (typeof option === 'object' && !Array.isArray(option)) {
        const validation = isValidateOptionObject(option, i);

        if (!validation.isValid) {
          errors = [...validation.errors];
        }
      } else {
        errors.push(
          ValidationErrors.invalidType(`options[${i}]`, 'string or object')
        );
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
        errors.push(
          ValidationErrors.nonEmptyString('command.description')
        );
    } else {
      errors.push(
        ValidationErrors.required('command.description')
      );
    }

    if (typeof command.action !== 'undefined' && command.action !== null) {
      if (typeof command.action !== 'function' || (typeof command.action === 'object' && typeof (command.action as PromiseLike<unknown>).then !== 'function')) {
        errors.push(
          ValidationErrors.invalidType('command.action', 'function or promise')
        );
      }
    } else {
      errors.push(
        ValidationErrors.required('command.action')
      );
    }

    return {
      isValid: errors.length === 0,
      errors
    };

  }

  function validatePluginCommands(plugin: IPlugin): IValidationResult {
    let errors: string[] = [];

    if (typeof plugin.commands === 'undefined' || plugin.commands === null) {
      errors.push(
        ValidationErrors.required(ctxError.commands)
      );
      return { isValid: false, errors };
    }

    if (typeof plugin.commands !== 'object') {
      errors.push(
        ValidationErrors.invalidType(ctxError.commands, 'object')
      );
      return { isValid: false, errors };
    }

    if (Object.keys(plugin.commands).length < 1) {
      errors.push(
        ValidationErrors.cannotBeEmpty(ctxError.commands)
      );
    } else {
      for (let i = 0; Object.keys(plugin.commands).length > i; i++) {
        const key = Object.keys(plugin.commands)[i];
        const element = plugin.commands[key];

        if (typeof element !== 'object') {
          errors.push(
            ValidationErrors.invalidType('plugin.commands.<value>', 'object')
          );
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

  return {
    validatePluginMetadatas,
    validatePluginsInitializationFunction,
    validatePluginCommands
  }
}