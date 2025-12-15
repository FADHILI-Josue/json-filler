export const KEYWORDS = {
    email: ["email", "mail", "sender", "recipient"],
    phone: ["phone", "tel", "mobile", "fax", "cell"],
    name_first: ["firstname", "f_name", "fname"],
    name_last: ["lastname", "l_name", "lname", "surname"],
    name_user: ["username", "login", "user"],
    name_full: ["fullname", "name", "customer", "employee"],
    web: ["url", "website", "link", "avatar", "image", "photo", "logo"],
    org: ["company", "org", "business", "firm"],
    date: ["date", "dob", "birth", "day", "created", "updated"],
    time: ["time", "hour"],
    address: ["zip", "postal", "code"],
    color: ["color", "hex", "background"],
    id: ["id", "uuid", "guid", "token", "key"],
    text: ["desc", "bio", "message", "comment", "note", "body", "content"],
    password: ["password", "pass", "passwd", "pwd", "secret", "pin", "passcode"]
};

export function matches(key: string, keywords: string[]): boolean {
    const lowerKey = key.toLowerCase();
    return keywords.some((keyword) => lowerKey.includes(keyword));
}