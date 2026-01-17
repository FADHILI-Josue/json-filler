/**
 * Configuration types for field data generation
 */

export type DataType = 
    | "email"
    | "phone"
    | "name_first"
    | "name_last"
    | "name_full"
    | "name_user"
    | "url"
    | "website"
    | "organization"
    | "date"
    | "time"
    | "address"
    | "color"
    | "uuid"
    | "id"
    | "text"
    | "password"
    | "number"
    | "boolean"
    | "enum"
    | "string"
    | "auto"; // Auto-detect based on value

export interface EnumConfig {
    type: "enum";
    values: string[];
}

export interface CustomStringConfig {
    type: "string";
    pattern?: string; // Regex pattern or template
}

export interface FieldConfig {
    dataType: DataType;
    enumConfig?: EnumConfig;
    customStringConfig?: CustomStringConfig;
    min?: number; // For numbers
    max?: number; // For numbers
}

export interface FieldMapping {
    [fieldPath: string]: FieldConfig; // Field path like "user.email" or just "email"
}

export interface FieldConfigStore {
    mappings: FieldMapping;
    version: number;
}
