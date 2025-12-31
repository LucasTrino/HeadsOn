import { IPluginValidationMetadatas } from "./interfaces/pluginValidationMetadatas.interface.js";

const metadataValidationProperties: IPluginValidationMetadatas[] = [
  {
    name: 'name',
    required: true,
    type: 'non-empty-string',
  },
  {
    name: 'version',
    validation: (version: string) => {
      if (typeof version !== 'string')
        return false;
      const trimmed = version.trim();
      if (trimmed.length === 0)
        return false;
      return /^\d+\.\d+\.\d+$/.test(trimmed)
    },
    required: true,
    type: 'non-empty-string',
  },
  {
    name: 'description',
    required: true,
    type: 'non-empty-string',
  },
  {
    name: 'handler',
    required: true,
    type: 'non-empty-string',
  }
]

export default metadataValidationProperties;