import { isUuid } from "../../lib/isUUID";
import { keyCategory } from "./heuristics";
import { generateSmartNumber } from "../math-utils";
import { EMAIL_REGEX, TEL_REGEX } from "../constants";
import { FieldConfig } from "../config-types";
import { generateFromConfig } from "./config-processor";

export function generateLeafValue(originalValue: any, key: string, fieldConfig?: FieldConfig | null): any {
    // 0. Check if configuration exists (highest priority)
    if (fieldConfig && fieldConfig.dataType !== "auto") {
        return generateFromConfig(fieldConfig, originalValue);
    }

    // 1. Value-based type detection (checks actual value format first)
    if (typeof originalValue === "string") {
        if (isUuid(originalValue)) return generateFromConfig({ dataType: "uuid" }, originalValue);
        if (EMAIL_REGEX.test(originalValue)) return generateFromConfig({ dataType: "email" }, originalValue);
        if (TEL_REGEX.test(originalValue)) return generateFromConfig({ dataType: "phone" }, originalValue);
        if (/^https?:\/\/\S+$/i.test(originalValue)) return generateFromConfig({ dataType: "url" }, originalValue);
    }

    if (typeof originalValue === "number") {
        return generateSmartNumber(originalValue);
    }

    if (typeof originalValue === "boolean") {
        return Math.random() > 0.5;
    }

    // 2. Key-based heuristics (fallback when value type cannot be determined)
    return generateFromConfig({ dataType: keyCategory(key) ?? "string" }, originalValue);
}
