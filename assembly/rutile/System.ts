import { call, getReturnDataSize, returnDataCopy, finish, revert } from "../utils/env";
import { printMemHex, print32, printString } from "../utils/debug";
import { u256 } from '../../node_modules/bignum/assembly/integer/u256';
import StringMemory from "./utils/StringMemory";
import { toAddressPointer } from "./utils/toAddress";
import { debug } from "./Debug";

let KECCAK_ADDRESS = u256.fromU64(9);

class System {
    keccak256(value: string): ArrayBuffer {
        let ptrAddress = toAddressPointer(KECCAK_ADDRESS);
        let valueBuffer = String.UTF8.encode(value);
        let ptrValue = changetype<usize>(valueBuffer);

        // Make sure our value is not changing in memory
        __retain(ptrValue);

        // Calls the system contract for Keccak256
        // TODO: Place in the actual current gas amount
        let returnCode = call(8000000, ptrAddress, 0, ptrValue, valueBuffer.byteLength);

        // Release the value
        __release(ptrValue);

        // 1 Means the code execution has failed.
        if (returnCode === 1 || returnCode === 2) {
            return new ArrayBuffer(0);
        }

        let returnDataSize = getReturnDataSize();
        let ptrDataCopy = __alloc(returnDataSize, idof<ArrayBuffer>());
        returnDataCopy(ptrDataCopy, 0, returnDataSize);

        return changetype<ArrayBuffer>(ptrDataCopy);
    }

    /**
     * Reverts the current execution and displays a message on why
     *
     * @param {string} message
     * @memberof System
     */
    revert(message: string): void {
        let messageBuffer = String.UTF8.encode(message);
        let ptrMessage = changetype<usize>(messageBuffer);

        revert(ptrMessage, messageBuffer.byteLength);
    }
}

export let system: System = new System();
