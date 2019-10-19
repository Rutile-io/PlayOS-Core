
/**
 * Reverses the bytes for 32bit integers
 *
 * @export
 * @param {i32} value
 * @returns {i32}
 */
export function reverseBytes(value: i32): i32 {
    let v = (value & 0x000000FF) << 24 | (value & 0x0000FF00) << 8 | (value & 0x00FF0000) >> 8 | (value & 0xFF000000) >> 24;
    return v;
}

/**
 * Reverses the bytes for 64bit integers
 *
 * @export
 * @param {i64} value
 * @returns {i64}
 */
export function reverseBytes64(value: i64): i64 {
    value = (value & 0x00000000FFFFFFFF) << 32 | (value & 0xFFFFFFFF00000000) >> 32;
    value = (value & 0x0000FFFF0000FFFF) << 16 | (value & 0xFFFF0000FFFF0000) >> 16;
    value = (value & 0x00FF00FF00FF00FF) << 8  | (value & 0xFF00FF00FF00FF00) >> 8;

    return value;
}