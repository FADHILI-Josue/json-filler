import { generateFakeData } from "./utils/generator";
import { showErrorToast } from "./utils/styles";

const el = document.activeElement;

(async () => {
    try {
        if (
            el instanceof HTMLTextAreaElement
            // || el instanceof HTMLInputElement
        ) {
            try {
                const inputData = JSON.parse(el.value)
                el.value = generateFakeData(inputData);
            } catch (error) {
                throw Error("Invalid json provided")
            }

            // Trigger input event (important for React/Vue)
            el.dispatchEvent(new Event("input", { bubbles: true }));
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        showErrorToast(message);
    }
})()