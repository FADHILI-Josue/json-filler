// Run: pnpm test
import { keyCategory } from "./utils/generator/heuristics";
import { generateLeafValue } from "./utils/generator/processor";
import { generateSmartNumber } from "./utils/math-utils";

function eq(actual: unknown, expected: unknown, label: string) {
    if (actual !== expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
}

// Key heuristics: whole words, last word wins, "name" is weakest
const keys: Record<string, string | undefined> = {
    userId: "id", valid: undefined, shipping: undefined, hotel: undefined, cancelled: undefined,
    countryCode: undefined, companyName: "organization", firstName: "name_first", first_name: "name_first",
    userName: "name_user", emailAddress: "email", description: "text", avatarUrl: "url", userID: "id",
    zipCode: "address", phoneNumber: "phone", name: "name_full", createdAt: "date"
};
for (const [key, type] of Object.entries(keys)) eq(keyCategory(key), type, `keyCategory(${key})`);

for (let i = 0; i < 200; i++) {
    // URL detection is stable across calls and ignores dotted non-URLs
    eq(String(generateLeafValue("https://a.com", "x")).startsWith("https://"), true, "url value");
    eq(String(generateLeafValue("1.2.3", "version")).startsWith("https://"), false, "dotted non-url");

    // Numbers keep sign, scale and precision
    const neg = generateSmartNumber(-5);
    eq(neg <= 0 && neg >= -9, true, `-5 -> ${neg}`);
    const frac = generateSmartNumber(0.5);
    eq(frac >= 0 && frac < 1, true, `0.5 -> ${frac}`);
    const big = generateSmartNumber(1234);
    eq(big >= 1000 && big <= 9999, true, `1234 -> ${big}`);
    const dec = generateSmartNumber(-12.34);
    eq(dec <= -10 && dec > -100 && (String(dec).split(".")[1] ?? "").length <= 2, true, `-12.34 -> ${dec}`);
}
eq(generateSmartNumber(1e21), 1e21, "exponent passthrough");

console.log("ok");
