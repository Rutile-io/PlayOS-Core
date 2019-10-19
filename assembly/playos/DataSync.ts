import RvmArray from "../rutile/RvmArray";
import { getCallDataSize, revert, callDataCopy, finish, storageStore, storageLoad } from "../utils/env";
import { reverseBytes } from "../utils/reverseBytes";
import { createTypedArray } from "../rutile/utils/createTypedArray";
import { u256 } from '../../node_modules/bignum/assembly/integer/u256';
import { system } from "../rutile/System";
import { debug } from "../rutile/Debug";

export function datasyncGet(): void {
    debug.print('Sync getting');

    let ptrKey = <i32>__alloc(32, 0);
    let ptrValue = <i32>__alloc(32, 0);
    callDataCopy(ptrKey, 4, 36);

    storageLoad(ptrKey, ptrValue);

    finish(ptrValue, 32);
}

export function datasyncSet(): void {
    debug.print('Sync setting');

    if (getCallDataSize() < 68) {
        debug.print32(getCallDataSize());
        system.revert(`data should be 68 bytes`);
    }

    // TOOD: Permission checks for address
    let ptrKey = <i32>__alloc(32, 0);
    let ptrValue = <i32>__alloc(32, 0);

    // Move over the data
    callDataCopy(ptrKey, 4, 36);
    callDataCopy(ptrValue, 36, 68);

    storageStore(ptrKey, ptrValue, 32, 32);

    finish(ptrKey, 32);
}

export function datasyncRemove(): void {
    // TOOD: Permission checks for address
    const datasyncStore = new RvmArray('datasync');
}
