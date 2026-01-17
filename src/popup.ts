/**
 * Popup UI for managing JSON Filler configurations
 */
import { getConfig, saveConfig, removeFieldConfig, clearAllConfigs, exportConfigs, importConfigs } from "./utils/config-manager";
import { FieldConfig, DataType } from "./utils/config-types";

// SVG Constants for dynamic injection
const ICONS = {
    empty: '<svg class="icon" style="width:32px;height:32px;color:#d1d5db;display:block;margin-bottom:8px" viewBox="0 0 24 24"><path d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"/></svg>',
    edit: '<svg class="icon" style="width:16px;height:16px;" viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/></svg>',
    delete: '<svg class="icon" style="width:16px;height:16px;" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>',
    save: '<svg class="icon" viewBox="0 0 24 24"><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/></svg>',
    update: '<svg class="icon" viewBox="0 0 24 24"><path d="M21,10.12H14.22L16.96,7.3C14.55,4.6 10.43,4.53 8,7.03C5.57,9.5 5.63,13.55 8.13,16C10.6,18.47 14.65,18.4 17.15,15.89C17.65,15.4 18.1,14.82 18.44,14.21L19.95,15.72C19.29,16.73 18.37,17.65 17.22,18.45C13.45,21.2 8.07,20.45 5.32,16.68C2.57,12.91 3.32,7.53 7.09,4.78C10.14,2.56 14.3,2.94 16.96,5.88L21,1.88V10.12Z"/></svg>'
};

// DOM Elements
const configForm = document.getElementById("configForm") as HTMLFormElement;
const fieldPathInput = document.getElementById("fieldPath") as HTMLInputElement;
const dataTypeSelect = document.getElementById("dataType") as HTMLSelectElement;
const enumGroup = document.getElementById("enumGroup") as HTMLDivElement;
const enumValuesTextarea = document.getElementById("enumValues") as HTMLTextAreaElement;
const numberGroup = document.getElementById("numberGroup") as HTMLDivElement;
const numberMinInput = document.getElementById("numberMin") as HTMLInputElement;
const numberMaxInput = document.getElementById("numberMax") as HTMLInputElement;
const configsList = document.getElementById("configsList") as HTMLDivElement;
const exportBtn = document.getElementById("exportBtn") as HTMLButtonElement;
const importBtn = document.getElementById("importBtn") as HTMLButtonElement;
const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
const successMessage = document.getElementById("successMessage") as HTMLDivElement;

// Track original field path when editing
let editingFieldPath: string | null = null;

// Show/hide form groups based on data type
dataTypeSelect.addEventListener("change", () => {
    const dataType = dataTypeSelect.value as DataType;
    enumGroup.classList.toggle("hidden", dataType !== "enum");
    numberGroup.classList.toggle("hidden", dataType !== "number");
});

// Handle form submission
configForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fieldPath = fieldPathInput.value.trim();
    const dataType = dataTypeSelect.value as DataType;

    if (!fieldPath) {
        showMessage("Field path is required", false);
        return;
    }

    const config: FieldConfig = {
        dataType
    };

    // Handle enum configuration
    if (dataType === "enum") {
        const enumValues = enumValuesTextarea.value
            .split(",")
            .map(v => v.trim())
            .filter(v => v.length > 0);
        
        if (enumValues.length === 0) {
            showMessage("At least one enum value is required", false);
            return;
        }

        config.enumConfig = {
            type: "enum",
            values: enumValues
        };
    }

    // Handle number configuration
    if (dataType === "number") {
        const min = numberMinInput.value ? parseFloat(numberMinInput.value) : undefined;
        const max = numberMaxInput.value ? parseFloat(numberMaxInput.value) : undefined;
        
        if (min !== undefined) config.min = min;
        if (max !== undefined) config.max = max;
    }

    // If editing and field path changed, remove old config
    if (editingFieldPath && editingFieldPath !== fieldPath) {
        await removeFieldConfig(editingFieldPath);
    }

    // Save configuration
    const currentConfig = await getConfig();
    currentConfig.mappings[fieldPath] = config;
    await saveConfig(currentConfig);

    // Reset form and editing state
    resetForm();

    // Reload configurations list
    await loadConfigurations();

    showMessage(editingFieldPath ? "Configuration updated" : "Configuration saved", true);
});

function resetForm() {
    configForm.reset();
    enumGroup.classList.add("hidden");
    numberGroup.classList.add("hidden");
    editingFieldPath = null;
    
    // Reset button text to Save Icon
    const submitBtn = configForm.querySelector("button[type='submit']") as HTMLButtonElement;
    if(submitBtn) {
        submitBtn.innerHTML = `${ICONS.save} Save Configuration`;
    }
}

// Load and display configurations
async function loadConfigurations() {
    const config = await getConfig();
    const mappings = config.mappings;

    if (Object.keys(mappings).length === 0) {
        configsList.innerHTML = `
            <div class="empty-state">
                ${ICONS.empty}
                No custom rules defined.<br>
                The extension works automatically without them!
            </div>`;
        return;
    }

    configsList.innerHTML = "";

    for (const [fieldPath, fieldConfig] of Object.entries(mappings)) {
        const configItem = document.createElement("div");
        configItem.className = "config-item";

        // HTML Structure for the new Card design
        const infoDiv = document.createElement("div");
        infoDiv.className = "config-info";

        const pathSpan = document.createElement("span");
        pathSpan.className = "config-item-path";
        pathSpan.textContent = fieldPath;

        const typeSpan = document.createElement("span");
        typeSpan.className = "config-item-type";
        typeSpan.textContent = fieldConfig.dataType;

        infoDiv.appendChild(pathSpan);
        infoDiv.appendChild(typeSpan);

        // Enum values preview
        if (fieldConfig.dataType === "enum" && fieldConfig.enumConfig) {
            const enumDiv = document.createElement("div");
            enumDiv.className = "enum-values";
            // Show max 3 items
            const displayValues = fieldConfig.enumConfig.values.slice(0, 3);
            displayValues.forEach(value => {
                const tag = document.createElement("span");
                tag.className = "enum-value-tag";
                tag.textContent = value;
                enumDiv.appendChild(tag);
            });
            if (fieldConfig.enumConfig.values.length > 3) {
                 const tag = document.createElement("span");
                 tag.className = "enum-value-tag";
                 tag.textContent = `+${fieldConfig.enumConfig.values.length - 3} more`;
                 enumDiv.appendChild(tag);
            }
            infoDiv.appendChild(enumDiv);
        }

        // Min/Max preview
        if (fieldConfig.dataType === "number" && (fieldConfig.min !== undefined || fieldConfig.max !== undefined)) {
            const rangeDiv = document.createElement("div");
            rangeDiv.style.marginTop = "4px";
            rangeDiv.style.fontSize = "11px";
            rangeDiv.style.color = "#6b7280";
            const rangeText = [];
            if (fieldConfig.min !== undefined) rangeText.push(`Min: ${fieldConfig.min}`);
            if (fieldConfig.max !== undefined) rangeText.push(`Max: ${fieldConfig.max}`);
            rangeDiv.textContent = rangeText.join(" • ");
            infoDiv.appendChild(rangeDiv);
        }

        // Actions
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "config-item-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-secondary btn-icon";
        editBtn.title = "Edit";
        editBtn.innerHTML = ICONS.edit;
        editBtn.onclick = () => editConfig(fieldPath, fieldConfig);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-icon";
        deleteBtn.title = "Delete";
        deleteBtn.innerHTML = ICONS.delete;
        deleteBtn.onclick = () => deleteConfig(fieldPath);

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        const headerDiv = document.createElement("div");
        headerDiv.className = "config-item-header";
        headerDiv.appendChild(infoDiv);
        headerDiv.appendChild(actionsDiv);

        configItem.appendChild(headerDiv);
        configsList.appendChild(configItem);
    }
}

async function editConfig(fieldPath: string, fieldConfig: FieldConfig) {
    editingFieldPath = fieldPath;
    fieldPathInput.value = fieldPath;
    dataTypeSelect.value = fieldConfig.dataType;

    if (fieldConfig.dataType === "enum" && fieldConfig.enumConfig) {
        enumGroup.classList.remove("hidden");
        enumValuesTextarea.value = fieldConfig.enumConfig.values.join(", ");
    } else {
        enumGroup.classList.add("hidden");
    }

    if (fieldConfig.dataType === "number") {
        numberGroup.classList.remove("hidden");
        numberMinInput.value = fieldConfig.min?.toString() || "";
        numberMaxInput.value = fieldConfig.max?.toString() || "";
    } else {
        numberGroup.classList.add("hidden");
    }

    // Update submit button visual state
    const submitBtn = configForm.querySelector("button[type='submit']") as HTMLButtonElement;
    if(submitBtn) {
        submitBtn.innerHTML = `${ICONS.update} Update Configuration`;
    }

    // Scroll to form
    document.querySelector(".section")?.scrollIntoView({ behavior: "smooth" });
    fieldPathInput.focus();
}

async function deleteConfig(fieldPath: string) {
    if (confirm(`Are you sure you want to delete the rule for "${fieldPath}"?`)) {
        await removeFieldConfig(fieldPath);
        await loadConfigurations();
        showMessage("Rule deleted", true);
        
        // If we were editing this item, clear the form
        if (editingFieldPath === fieldPath) {
            resetForm();
        }
    }
}

// Export configurations
exportBtn.addEventListener("click", async () => {
    const configJson = await exportConfigs();
    const blob = new Blob([configJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "json-filler-config.json";
    a.click();
    URL.revokeObjectURL(url);
    showMessage("Export successful", true);
});

// Import configurations
importBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            try {
                const text = await file.text();
                await importConfigs(text);
                await loadConfigurations();
                showMessage("Import successful", true);
            } catch (error) {
                showMessage("Import failed: Invalid JSON", false);
            }
        }
    };
    input.click();
});

// Clear all configurations
clearBtn.addEventListener("click", async () => {
    if (confirm("Clear ALL custom configurations? This cannot be undone.")) {
        await clearAllConfigs();
        await loadConfigurations();
        showMessage("All configurations cleared", true);
    }
});

function showMessage(message: string, isSuccess: boolean) {
    successMessage.textContent = message;
    successMessage.style.background = isSuccess ? "#10b981" : "#ef4444";
    successMessage.classList.remove("hidden");

    // Reset animation
    successMessage.style.animation = 'none';
    successMessage.offsetHeight; /* trigger reflow */
    successMessage.style.animation = null!;

    setTimeout(() => {
        successMessage.classList.add("hidden");
    }, 3000);
}

// Load configurations on page load
loadConfigurations();
