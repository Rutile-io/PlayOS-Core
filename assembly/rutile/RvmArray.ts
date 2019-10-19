import { system } from "./System";
import { u256 } from '../../node_modules/bignum/assembly/integer/u256';
import { createTypedArray } from "./utils/createTypedArray";
import { storageLoad, storageStore } from "../utils/env";

class RvmArray {
    public length: i32 = 0;
    private prefix: string;
    private startNumber: u256;

    /**
     *Creates an instance of RvmArray.

     * @param {string} prefix The prefix of the array (It's comparable to the name of the array)
     * @memberof RvmArray
     */
    constructor(prefix: string) {
        this.prefix = prefix;
        this.init();
    }

    /**
     * Initializes the array by hashing the prefix and using this as a counter
     *
     * @private
     * @memberof RvmArray
     */
    private init(): void {
        // First check if the current prefix is already available.
        const hash = system.keccak256(this.prefix);
        const typedArrayHash = createTypedArray<Uint8Array, u8>(hash);
        const startNumber = u256.fromBytes(typedArrayHash, true);

        // Make sure we loaded in the right length of the array
        let ptrArrayLength = __alloc(32, idof<ArrayBuffer>());
        let startNumberPtr = changetype<usize>(typedArrayHash.buffer);

        storageLoad(startNumberPtr, ptrArrayLength);

        // Now convert our ptr for the array length to something useful
        const lengthBuffer = changetype<ArrayBuffer>(ptrArrayLength);
        const lengthTypedArray = createTypedArray<Uint8Array, u8>(lengthBuffer);
        const length = u256.fromBytes(lengthTypedArray, true);
        this.length = length.toI32();
        
        let ptrLength = changetype<usize>(lengthTypedArray.buffer);
        __retain(ptrLength);

        // It's possible that the prefix + length has not been stored yet.
        if (!this.length) {
            storageStore(startNumberPtr, ptrLength);
        }

        __retain(startNumberPtr);

        this.startNumber = startNumber;
    }

    set(): void {

    }

    /**
     * Gets an item from the array
     *
     * @param {i32} index
     * @returns {u256}
     * @memberof RvmArray
     */
    get(index: i32): u256 {
        const itemIndex = u256.add(u256.fromI32(index), this.startNumber);
        const itemIndexBuffer = itemIndex.toUint8Array(true).buffer;

        let ptrItemIndex = changetype<usize>(itemIndexBuffer);
        let ptrItemValue = __alloc(32, idof<ArrayBuffer>());
        
        storageLoad(ptrItemIndex, ptrItemValue);

        const itemValueBuffer = changetype<ArrayBuffer>(ptrItemValue);
        const valueTypedArray = createTypedArray<Uint8Array, u8>(itemValueBuffer);
        const value = u256.fromBytes(valueTypedArray, true);

        // Prevent value from leaving memory.
        let ptrValue = changetype<usize>(valueTypedArray.buffer);
        __retain(ptrValue);

        return value;
    }

    /**
     * Pushes a 256bit number onto the array and stores it in storage
     *
     * @param {u256} item
     * @memberof RvmArray
     */
    push(item: u256): void {
        this.length += 1;

        const startNumberBuffer = this.startNumber.toUint8Array(true).buffer;
        const lengthBuffer = u256.fromI32(this.length).toUint8Array(true).buffer;

        let ptrStartNumber = changetype<usize>(startNumberBuffer);
        let ptrLength = changetype<usize>(lengthBuffer);

        // Store the new Length
        storageStore(ptrStartNumber, ptrLength);

        const itemIndex = u256.add(u256.fromI32(this.length), this.startNumber);
        const itemIndexBuffer = itemIndex.toUint8Array(true).buffer;
        const itemBuffer = item.toUint8Array(true).buffer;
        
        let ptrItem = changetype<usize>(itemBuffer);
        let ptrItemIndex = changetype<usize>(itemIndexBuffer);

        // And store the actual value
        storageStore(ptrItemIndex, ptrItem);
    }

    pop(): void {
        this.length -= 1;
    }
}

export default RvmArray;