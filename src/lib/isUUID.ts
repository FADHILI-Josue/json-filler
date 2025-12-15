import { UUID_REGEX } from "../utils/constants";

/**
 * ## isUuid
 * @param  uuid
 * @returns { Boolean }
 */
export function isUuid(uuid: string): boolean {
  return !!uuid.match(UUID_REGEX)
}