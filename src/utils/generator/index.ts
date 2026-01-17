import { generateLeafValue } from "./processor";
import { FieldMapping, FieldConfig } from "../config-types";

export const generateFakeData = (inputData: unknown, fieldMappings?: FieldMapping): string => {
    const result = traverseAndFill(inputData, "", fieldMappings || {});
    return JSON.stringify(result, null, 2);
};


function traverseAndFill(node: any, path: string = "", fieldMappings: FieldMapping = {}): any {
    // Handle Arrays
    if (Array.isArray(node)) {
        return node.map((item, index) => traverseAndFill(item, path, fieldMappings));
    }

    // Handle Objects
    if (typeof node === "object" && node !== null) {
        const newObj: Record<string, any> = {};
        for (const k in node) {
            if (Object.prototype.hasOwnProperty.call(node, k)) {
                const currentPath = path ? `${path}.${k}` : k;
                newObj[k] = traverseAndFill(node[k], currentPath, fieldMappings);
            }
        }
        return newObj;
    }

    // Handle Primitives - get config for this path or just the key name
    const config = fieldMappings[path] || fieldMappings[path.split('.').pop() || ""] || null;
    return generateLeafValue(node, path.split('.').pop() || "", config);
}