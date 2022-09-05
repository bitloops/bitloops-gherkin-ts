/**
 * Decodes a string containing an array of comma separated number
 * representing a Uint8Array.
 */
export const decode: (encodedString: string) => string;

/**
 * Shorthand for decode.
 * Decodes a string containing an array of comma separated number
 * representing a Uint8Array.
 */
export const d: (encodedString: string) => string;

/**
 * Encodes a string to a Uint8Array.
 */
export const encode: (input?: string) => Uint8Array;

/**
 * Shorthand for encode.
 * Encodes a string to a Uint8Array.
 */
export const e: (input?: string) => Uint8Array;
