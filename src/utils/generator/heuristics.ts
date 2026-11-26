import { DataType } from "../config-types";

export const KEYWORDS: Partial<Record<DataType, string[]>> = {
    email: ["email", "mail", "sender", "recipient"],
    phone: ["phone", "telephone", "tel", "mobile", "fax", "cell", "cellphone"],
    name_first: ["firstname", "fname", "givenname"],
    name_last: ["lastname", "lname", "surname", "familyname"],
    name_user: ["username", "login", "user", "nickname"],
    name_full: ["fullname", "name", "customer", "employee"],
    url: ["url", "uri", "href", "website", "link", "avatar", "image", "photo", "logo"],
    organization: ["company", "org", "organization", "organisation", "business", "firm"],
    date: ["date", "dob", "birth", "birthday", "birthdate", "day", "created", "updated", "timestamp"],
    time: ["time", "hour"],
    address: ["zip", "zipcode", "postal", "postalcode", "postcode"],
    color: ["color", "colour", "hex", "background"],
    id: ["id", "uuid", "guid", "token", "key"],
    text: ["desc", "description", "bio", "message", "comment", "note", "body", "content", "summary"],
    password: ["password", "pass", "passwd", "pwd", "secret", "pin", "passcode"]
};

/**
 * Guess a data type from a key by whole words, not substrings ("valid" is not an "id").
 * The joined key is tried first ("first_name" -> "firstname"), then words from last to first
 * ("userId" is an id), with "name" last ("companyName" is a company).
 */
export function keyCategory(key: string): DataType | undefined {
    const words = (key.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g) || []).map((w) => w.toLowerCase());
    const candidates = [
        words.join(""),
        ...words.filter((w) => w !== "name").reverse(),
        ...(words.includes("name") ? ["name"] : [])
    ];
    for (const word of candidates) {
        for (const [type, keywords] of Object.entries(KEYWORDS)) {
            if (keywords.some((k) => word === k || word === `${k}s`)) return type as DataType;
        }
    }
    return undefined;
}
