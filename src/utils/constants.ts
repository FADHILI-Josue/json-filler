export const DEFAULT_TELEPHONE_TEMPLATE = "+1 (XxX) XxX-XxxX";

export const CURRENT_SETTINGS_VERSION = 2;

export const TEL_REGEX =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i