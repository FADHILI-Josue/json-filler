import DataGenerator from "../data-generator";
import { isUuid } from "../../lib/isUUID";
import { matches, KEYWORDS } from "./heuristics";
import { generateSmartNumber } from "../math-utils";
import { EMAIL_REGEX, TEL_REGEX, URL_REGEX } from "../constants";

const gen = new DataGenerator();

function isEmail(value: string): boolean {
    return EMAIL_REGEX.test(value);
}

function isPhone(value: string): boolean {
    return TEL_REGEX.test(value);
}

function isUrl(value: string): boolean {
    return URL_REGEX.test(value) && (value.startsWith('http://') || value.startsWith('https://') || value.includes('.'));
}


export function generateLeafValue(originalValue: any, key: string): any {
    // 1. Value-based type detection (checks actual value format first)
    if (typeof originalValue === "string") {
        if (isUuid(originalValue)) {
            return crypto.randomUUID ? crypto.randomUUID() : "63a878f5-53bc-4ad3-ace8-a89302413d0b";
        }
        
        if (isEmail(originalValue)) {
            return generateEmail();
        }
        
        if (isPhone(originalValue)) {
            return gen.phoneNumber();
        }
        
        if (isUrl(originalValue)) {
            return gen.website();
        }
    }

    if (typeof originalValue === "number") {
        return generateSmartNumber(originalValue)
    }

    if (typeof originalValue === "boolean") {
        return Math.random() > 0.5;
    }

    // 2. Key-based Heuristics (fallback when value type cannot be determined)
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