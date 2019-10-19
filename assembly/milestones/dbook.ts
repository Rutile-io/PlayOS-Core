import RvmArray from "../rutile/RvmArray";
import { getCallDataSize, revert, callDataCopy, finish } from "../utils/env";
import { createTypedArray } from "../rutile/utils/createTypedArray";
import { u256 } from '../../node_modules/bignum/assembly/integer/u256';
import { debug } from "../rutile/Debug";

export function dbookPost(): void {
    debug.print('dbookPost');
    // We must always have 32 bytes
    if (getCallDataSize() < 36) {
        revert(0, 0);
    }

    let ptrPost = <i32>__alloc(32, 0);
    callDataCopy(ptrPost, 5, 37);
    let postBuffer = changetype<ArrayBuffer>(ptrPost);
    let postTypedArray = createTypedArray<Uint8Array, u8>(postBuffer);

    const posts = new RvmArray('dbook_posts');
    posts.push(u256.fromBytes(postTypedArray, true));


    finish(0, 0)
}

export function dbookGetAll(): void {
    debug.print('dbookGetAll');
    const posts = new RvmArray('dbook_posts');
    const result: Uint8Array[] = [];
    
    for (let index = 0; index < posts.length; index++) {
        result.push(posts.get(index).toUint8Array(true));
    }

    const arraybuffer = changetype<ArrayBuffer>(result);
    const ptrBuffer = changetype<usize>(arraybuffer);

    debug.printMemHex(ptrBuffer, arraybuffer.byteLength);

    finish(ptrBuffer, arraybuffer.byteLength);
}