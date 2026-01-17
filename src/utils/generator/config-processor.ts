/**
 * Configuration Processor - Generates values based on field configurations
 */
import DataGenerator from "../data-generator";
import { FieldConfig, DataType } from "../config-types";

const gen = new DataGenerator();

/**
 * Generate a value based on the provided field configuration
 */
export function generateFromConfig(config: FieldConfig, originalValue: any): any {
    const { dataType, enumConfig, customStringConfig, min, max } = config;

    // Handle enum type
    if (dataType === "enum" && enumConfig && enumConfig.values.length > 0) {
        const randomIndex = Math.floor(Math.random() * enumConfig.values.length);
        return enumConfig.values[randomIndex];
    }

    // Handle number type with min/max
    if (dataType === "number") {
        const minVal = min !== undefined ? min : 0;
        const maxVal = max !== undefined ? max : 1000;
        return gen.randomNumber(minVal, maxVal);
    }

    // Handle boolean type
    if (dataType === "boolean") {
        return Math.random() > 0.5;
    }

    // Handle string types
    switch (dataType) {
        case "email":
            return generateEmail();
        case "phone":
            return gen.phoneNumber();
        case "name_first":
            return gen.firstName();
        case "name_last":
            return gen.lastName();
        case "name_full":
            return `${gen.firstName()} ${gen.lastName()}`;
        case "name_user":
            return `${gen.firstName()}${gen.randomNumber(1, 99)}`;
        case "url":
        case "website":
            return gen.website();
        case "organization":
            return gen.organizationName();
        case "date":
            return gen.date(new Date("2000-01-01"));
        case "time":
            return gen.time();
        case "address":
            return gen.randomNumber(10000, 99999).toString();
        case "color":
            return gen.color();
        case "uuid":
            return crypto.randomUUID ? crypto.randomUUID() : "63a878f5-53bc-4ad3-ace8-a89302413d0b";
        case "id":
            return crypto.randomUUID ? crypto.randomUUID() : `${gen.randomNumber(100000, 999999)}`;
        case "text":
            return gen.paragraph(10, 20, 200);
        case "password":
            return "Pa$$w0rd!";
        case "string":
            if (customStringConfig?.pattern) {
                return gen.alphanumeric(customStringConfig.pattern);
            }
            return gen.phrase(20);
        default:
            return gen.phrase(20);
    }
}

function generateEmail(): string {
    const first = gen.firstName().toLowerCase().replace(/[^a-z]/g, "");
    const last = gen.lastName().toLowerCase().replace(/[^a-z]/g, "");
    const domain = ["gmail.com", "outlook.com", "example.com"][gen.randomNumber(0, 2)];
    return `${first}.${last}@${domain}`;
}
