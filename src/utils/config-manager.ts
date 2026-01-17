/**
 * Configuration Manager - Handles storage and retrieval of field configurations
 */
import { FieldConfigStore, FieldMapping, FieldConfig } from "./config-types";

const STORAGE_KEY = "jsonFillerConfig";

/**
 * Get all field configurations from storage
 */
export async function getConfig(): Promise<FieldConfigStore> {
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
            if (result[STORAGE_KEY]) {
                resolve(result[STORAGE_KEY] as FieldConfigStore);
            } else {
                // Return default empty config
                resolve({
                    mappings: {},
                    version: 2
                });
            }
        });
    });
}

/**
 * Save field configurations to storage
 */
export async function saveConfig(config: FieldConfigStore): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY]: config }, () => {
            resolve();
        });
    });
}

/**
 * Get configuration for a specific field path
 */
export async function getFieldConfig(fieldPath: string): Promise<FieldConfig | null> {
    const config = await getConfig();
    return config.mappings[fieldPath] || null;
}

/**
 * Set configuration for a specific field path
 */
export async function setFieldConfig(fieldPath: string, fieldConfig: FieldConfig): Promise<void> {
    const config = await getConfig();
    config.mappings[fieldPath] = fieldConfig;
    await saveConfig(config);
}

/**
 * Remove configuration for a specific field path
 */
export async function removeFieldConfig(fieldPath: string): Promise<void> {
    const config = await getConfig();
    delete config.mappings[fieldPath];
    await saveConfig(config);
}

/**
 * Get all field paths that match a given path pattern
 * Supports nested paths like "user.email" matching "user.email"
 */
export async function getMatchingConfigs(fieldPath: string): Promise<Map<string, FieldConfig>> {
    const config = await getConfig();
    const matches = new Map<string, FieldConfig>();

    // Exact match first
    if (config.mappings[fieldPath]) {
        matches.set(fieldPath, config.mappings[fieldPath]);
        return matches;
    }

    // Check if any parent path has a config that applies
    const pathParts = fieldPath.split('.');
    for (let i = pathParts.length; i > 0; i--) {
        const partialPath = pathParts.slice(0, i).join('.');
        if (config.mappings[partialPath]) {
            matches.set(partialPath, config.mappings[partialPath]);
        }
    }

    return matches;
}

/**
 * Clear all configurations
 */
export async function clearAllConfigs(): Promise<void> {
    await saveConfig({
        mappings: {},
        version: 2
    });
}

/**
 * Export configurations as JSON
 */
export async function exportConfigs(): Promise<string> {
    const config = await getConfig();
    return JSON.stringify(config, null, 2);
}

/**
 * Import configurations from JSON
 */
export async function importConfigs(jsonString: string): Promise<void> {
    try {
        const config = JSON.parse(jsonString) as FieldConfigStore;
        await saveConfig(config);
    } catch (error) {
        throw new Error("Invalid configuration JSON");
    }
}
