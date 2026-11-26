import DataGenerator from "./data-generator";

const gen = new DataGenerator();

/** Random number with the same sign, digit count and decimal places as the original. */
export function generateSmartNumber(original: number): number {
    // Exponent notation (1e21, 1e-7) has no digit layout to copy
    if (/e/i.test(String(original))) return original;

    const sign = original < 0 ? -1 : 1;
    const [intPart, decPart = ""] = Math.abs(original).toString().split(".");
    const len = intPart.length;

    // Keep 0.x below 1; otherwise keep the digit count (single digits may become 0)
    const int = decPart && intPart === "0" ? 0 : gen.randomNumber(len === 1 ? 0 : 10 ** (len - 1), 10 ** len - 1);
    const dec = decPart
        ? `.${String(gen.randomNumber(0, 10 ** decPart.length - 1)).padStart(decPart.length, "0")}`
        : "";

    return sign * parseFloat(`${int}${dec}`);
}
