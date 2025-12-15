import DataGenerator from "../data-generator";
import { isUuid } from "../../lib/isUUID";
import { matches, KEYWORDS } from "./heuristics";
import { generateSmartNumber } from "../math-utils";

const gen = new DataGenerator();

export function generateLeafValue(originalValue: any, key: string): any {
    // 1. Value-based check (UUIDs)
    if (typeof originalValue === "string" && isUuid(originalValue)) {
        return crypto.randomUUID ? crypto.randomUUID() : "63a878f5-53bc-4ad3-ace8-a89302413d0b";
    }

    if (typeof originalValue === "number") {
        return generateSmartNumber(originalValue)
    }

    if (typeof originalValue === "boolean") {
        return Math.random() > 0.5;
    }

    // 2. Key-based Heuristics
    if (matches(key, KEYWORDS.email)) return generateEmail();
    if (matches(key, KEYWORDS.phone)) return gen.phoneNumber();
    if (matches(key, KEYWORDS.name_first)) return gen.firstName();
    if (matches(key, KEYWORDS.name_last)) return gen.lastName();
    if (matches(key, KEYWORDS.name_user)) return `${gen.firstName()}${gen.randomNumber(1, 99)}`;
    if (matches(key, KEYWORDS.name_full)) return `${gen.firstName()} ${gen.lastName()}`;
    if (matches(key, KEYWORDS.web)) return gen.website();
    if (matches(key, KEYWORDS.org)) return gen.organizationName();
    if (matches(key, KEYWORDS.date)) return gen.date(new Date("2000-01-01"));
    if (matches(key, KEYWORDS.time)) return gen.time();
    if (matches(key, KEYWORDS.address)) return gen.randomNumber(10000, 99999).toString();
    if (matches(key, KEYWORDS.color)) return gen.color();
    if (matches(key, KEYWORDS.id)) return crypto.randomUUID ? crypto.randomUUID() : `${gen.randomNumber(100000, 999999)}`;
    if (matches(key, KEYWORDS.text)) return gen.paragraph(10, 20, 200);
    if (matches(key, KEYWORDS.password)) return "Pa$$w0rd!";

    // Fallback
    return gen.phrase(20);

}

function generateEmail(): string {
    const first = gen.firstName().toLowerCase().replace(/[^a-z]/g, "");
    const last = gen.lastName().toLowerCase().replace(/[^a-z]/g, "");
    const domain = ["gmail.com", "outlook.com", "example.com"][gen.randomNumber(0, 2)];
    return `${first}.${last}@${domain}`;
}