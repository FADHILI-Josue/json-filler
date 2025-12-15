import { generateLeafValue } from "./processor";

export const generateFakeData = (inputData: unknown): string => {
    const result = traverseAndFill(inputData);
    return JSON.stringify(result, null, 2);
};


function traverseAndFill(node: any, key: string = ""): any {
    // Handle Arrays
    if (Array.isArray(node)) {
        return node.map((item) => traverseAndFill(item, key));
    }

    // Handle Objects
    if (typeof node === "object" && node !== null) {
        const newObj: Record<string, any> = {};
        for (const k in node) {
            if (Object.prototype.hasOwnProperty.call(node, k)) {
                newObj[k] = traverseAndFill(node[k], k);
            }
        }
        return newObj;
    }

    // Handle Primitives
    return generateLeafValue(node, key);
}