export interface IPluginValidationMetadatas {
  name: string;
  validation?: (value: any) => boolean;
  required: boolean;
  type: string; 
}
