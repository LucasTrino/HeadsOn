const metadataValidationProperties = [
  {
    name: 'name',
    required: true,
    type: 'non-empty-string',
    errorMessage: 'plugin has to have a \'name\' property of type non-empty string'
  },
  {
    name: 'version',
    validation: (version) => {
      if (typeof version !== 'string')
        return false;
      const trimmed = version.trim();
      if (trimmed.length === 0)
        return false;
      return /^\d+\.\d+\.\d+$/.test(trimmed)
    },
    required: true,
    type: 'non-empty-string',
    errorMessage: 'plugin has to have a \'version\' property of type non-empty string that matches a format \'0.0.0\' '
  },
  {
    name: 'description',
    required: true,
    type: 'non-empty-string',
    errorMessage: 'plugin has to have a \'description\' property of type non-empty string'
  },
  {
    name: 'handler',
    required: true,
    type: 'non-empty-string',
    errorMessage: 'plugin has to have a \'handler\' property of type non-empty string'
  }
]

export default metadataValidationProperties;