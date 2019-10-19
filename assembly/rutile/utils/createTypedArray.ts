/**
 * Creates a typed array with the given format
 *
 * @export
 * @template TArray The array type you want to use (Uint8Array, Uint16Array, etc)
 * @template T The type that is filling the array, usually the same as above. So for Uint8Array it's u8
 * @param {ArrayBuffer} buffer
 * @param {usize} [byteOffset=0]
 * @param {i32} [length=0]
 * @returns {TArray}
 */
export function createTypedArray<TArray, T>(
    buffer: ArrayBuffer, 
    byteOffset: usize = 0, 
    length: i32 = 0
): TArray {
    if (!length) length = buffer.byteLength / sizeof<T>();
    if (buffer.byteLength - byteOffset > length * sizeof<T>()) {
      throw new RangeError("Invalid typed array length");
    }
    var arr = __alloc(offsetof<TArray>(), idof<TArray>());
    store<ArrayBuffer>(arr, buffer, 0); // buffer
    store<ArrayBuffer>(arr, changetype<usize>(buffer) + byteOffset, sizeof<usize>()); // dataStart
    store<i32>(arr, length * sizeof<T>(), sizeof<usize>() * 2); // dataLength
    return changetype<TArray>(arr);
}