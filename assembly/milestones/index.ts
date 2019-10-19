import "rt"
import { reverseBytes } from '../utils/reverseBytes'
import { registerAsValidator, getNextValidator } from "./validator";
import '../utils/env';
import { getCallDataSize, revert, callDataCopy, finish } from "../utils/env";
import { print32 } from "../utils/debug";
import { debug } from "../rutile/Debug";
import { dbookPost, dbookGetAll } from "./dbook";

export function main(): void {
    // Make sure a function is being called
    if (getCallDataSize() < 4) {
        revert(0, 0);
    }

    let ptrSelector = <i32>__alloc(4, 0);
    callDataCopy(ptrSelector, 0, 4);
    let selector = reverseBytes(load<i32>(ptrSelector));

    debug.print('I GOT BIG BUTTS AND I CANNOT LIE');
    debug.print32(selector);

    // For now we are going to use fake selectors
    switch(selector) {
        case 0x00000001:
            debug.print('0x01');
            registerAsValidator();
            break;
        case 0x00000002:
            debug.print('0x02')
            getNextValidator();
            break;
        case 0x10000001:
            debug.print('Hello World, dbookPost');
            dbookPost();
            break;
        case 0x10000002:
            debug.print('0x00010222')
            dbookGetAll();
            break;
        default:
            debug.print('Reverting these bitches');
            revert(0, 0);
    }
}
