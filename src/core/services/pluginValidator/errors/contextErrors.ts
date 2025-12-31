const ctxError = {
  plugin: 'plugin',
  initialize: 'plugin.initialize',
  commands: 'plugin.commands',
  command: (name: string) => `plugin.commands.${name}`,
  options: (cmd: string) => `plugin.commands.${cmd}.options`,
  option: (cmd: string, i: number) => `plugin.commands.${cmd}.options[${i}]`,
  optionField: (cmd: string, i: number, field: string) =>
    `plugin.commands.${cmd}.options[${i}].${field}`,
  commandField: (cmd: string, field: string) =>
    `plugin.commands.${cmd}.${field}`
};

export default ctxError;