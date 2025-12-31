const ValidationErrors = {
  required: (ctx: string) =>
    `${ctx}: field is required`,

  mustBeArray: (ctx: string) =>
    `${ctx}: must be an array`,

  nonEmptyString: (ctx: string) =>
    `${ctx}: must be a non-empty string`,

  invalidType: (ctx: string, expected: string) =>
    `${ctx}: invalid type — expected ${expected}`,

  invalidFormat: (ctx: string, expected: string) =>
    `${ctx}: invalid format — expected ${expected}`,

  cannotBeEmpty: (ctx: string) =>
    `${ctx}: cannot be empty`
};

export default ValidationErrors