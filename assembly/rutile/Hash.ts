import { call, getReturnDataSize, returnDataCopy, finish, revert } from "../utils/env";
import { u256 } from '../../node_modules/bignum/assembly/integer/u256';
import { toAddressPointer } from "./utils/toAddress";

let KECCAK_ADDRESS = u256.fromU64(9);

/**
 * Creates a keccak256 hash from a pointer
 *
 * @export
 * @param {i32} ptrValue
 * @param {i32} length
 * @returns {ArrayBuffer}
 */
export function keccak256FromPtr(ptrValue: i32, length: i32): ArrayBuffer {
    let ptrAddress = toAddressPointer(KECCAK_ADDRESS);
    let returnCode = call(8000000, ptrAddress, 0, ptrValue, length);

    __release(ptrAddress);

    // 1/2 Means the code execution has failed.
    if (returnCode === 1 || returnCode === 2) {
        return new ArrayBuffer(0);
    }

    let returnDataSize = getReturnDataSize();
    let ptrDataCopy = __alloc(returnDataSize, idof<ArrayBuffer>());
    returnDataCopy(ptrDataCopy, 0, returnDataSize);

    return changetype<ArrayBuffer>(ptrDataCopy);
}
