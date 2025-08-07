import TPluginCommand from "../../../core/services/pluginManager/types/pluginCommand.type.js";

// TODO/QUESTION - 3.6.0
export function isPluginCommand(obj: unknown): obj is TPluginCommand {
  if (typeof obj !== 'object' || obj === null) return false;

  const cmd = obj as Partial<TPluginCommand>;

  if (typeof cmd.name !== 'string' || !cmd.name.trim()) return false;

  if (typeof cmd.description !== 'string' || !cmd.description.trim()) return false;

  if (typeof cmd.action !== 'function') return false;

  if (cmd.options !== undefined) {
    if (!Array.isArray(cmd.options)) return false;

    for (const option of cmd.options) {
      if (typeof option !== 'string' && typeof option !== 'object') return false;
    }
  }

  return true;
}

export function validateCommand(command: unknown): asserts command is TPluginCommand {
  if (!isPluginCommand(command)) {
    throw new TypeError(`Invalid plugin command object${command && typeof command === 'object' && 'name' in command ? `: "${(command as any).name}"` : ''}. Expected properties: name (non-empty string), description (non-empty string), action (function).`);
  }
}
