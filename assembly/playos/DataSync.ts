import RvmArray from "../rutile/RvmArray";
import { getCallDataSize, revert, callDataCopy, finish, storageStore, storageLoad, getAddress, getCaller } from "../utils/env";
import { reverseBytes } from "../utils/reverseBytes";
import { createTypedArray } from "../rutile/utils/createTypedArray";
import { u256 } from '../../node_modules/bignum/assembly/integer/u256';
import { system } from "../rutile/System";
import { debug } from "../rutile/Debug";
import pointerToString from "../rutile/utils/pointerToString";
import { printMemHex, printString } from "../utils/debug";

/**
 * Gets a variable from storage
 *
 * @export
 */
export function datasyncGet(): void {
    let ptrKey = <i32>__alloc(32, 0);
    let ptrValue = <i32>__alloc(32, 0);
    let ptrCaller = <i32>__alloc(32, 0);

    // Write data to the pointers
    callDataCopy(ptrKey, 4, 36);
    getCaller(ptrCaller);

    const key = pointerToString(ptrKey);
    const address = pointerToString(ptrCaller);
    const keyHash = system.keccak256(key + address);

    let ptrKeyHash = changetype<usize>(keyHash);
    storageLoad(ptrKeyHash, ptrValue);

    finish(ptrValue, 32);
}

/**
 * Sets a storage property by key->value
 *
 * @export
 */
export function datasyncSet(): void {
    if (getCallDataSize() < 68) {
        debug.print32(getCallDataSize());
        system.revert(`data should be 68 bytes`);
    }

    // TODO: Find the length of the value. It can be anything
    let ptrKey = <i32>__alloc(32, 0);
    let ptrCaller = <i32>__alloc(32, 0);
    let ptrValue = <i32>__alloc(32, 0);

    __retain(ptrKey);
    __retain(ptrCaller);
    __retain(ptrValue);

    // Move the data over to memory so we can use it
    callDataCopy(ptrKey, 4, 36);
    callDataCopy(ptrValue, 36, 68);
    getCaller(ptrCaller);

    debug.print('Converting pointers to strings');

    // First we have to create 2 keys.
    // One for storing the actual value hash(key + address) -> value
    // And one for storing the length of the value hash(key + address + 'length') -> value.length
    const key = pointerToString(ptrKey);
    __release(ptrKey);

    debug.print('Converting address to string');
    const callerBuffer = changetype<ArrayBuffer>(ptrCaller);

    debug.print('Doing it the method way');

    const address = pointerToString(ptrCaller);
    __release(ptrCaller);

    debug.print('Hashing it all together');
    // Hash the key and address (and length) in order to get a single length key
    const keyHash = system.keccak256(key + address);
    // const keyValueLengthHash = system.keccak256(key + address + 'length');

    // Convert all array buffers to a pointer.
    let ptrKeyHash = changetype<usize>(keyHash);
    // let ptrKeyValueLength = changetype<usize>(keyValueLengthHash);

    debug.print('Storing it all');

    storageStore(ptrKeyHash, ptrValue, 32, 32);

    finish(ptrKeyHash, 32);
}
