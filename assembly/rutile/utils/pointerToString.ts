import { debug } from "../Debug";

/**
 * Converts a pointer to a string
 *
 * @export
 * @param {*} ptr
 * @returns {string}
 */
export default function pointerToString(ptr: usize): string {
    const pointerBuffer: ArrayBuffer = changetype<ArrayBuffer>(ptr);
    const value: string = String.UTF8.decode(pointerBuffer);

    return value;
}
