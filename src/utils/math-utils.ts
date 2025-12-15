import DataGenerator from "./data-generator";

const gen = new DataGenerator();

export function generateSmartNumber(original: number): number {
    const originalString = original.toString();
    
    // Handle Decimals
    if (originalString.includes('.')) {
        const parts = originalString.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];

        // Generate integer part with same length
        const minInt = Math.pow(10, integerPart.length - 1);
        const maxInt = Math.pow(10, integerPart.length) - 1;
        
        // Generate decimal part
        // We generate a number and divide it to get the right precision
        const randomInt = gen.randomNumber(minInt, maxInt);
        const randomDecimal = gen.randomNumber(0, Math.pow(10, decimalPart.length) - 1);
        
        return parseFloat(`${randomInt}.${randomDecimal.toString().padStart(decimalPart.length, '0')}`);
    }

    // Handle Integers mantaining length
    const length = originalString.length;
    
    if (length === 1) {
        return gen.randomNumber(0, 9);
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    
    return gen.randomNumber(min, max);
}