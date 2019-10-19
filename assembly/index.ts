import "rt"
import { reverseBytes } from './utils/reverseBytes'
import { getCallDataSize, revert, callDataCopy } from "./utils/env";
import { debug } from "./rutile/Debug";
import { datasyncGet, datasyncSet } from "./playos/DataSync";
import { addApplicationToStore } from './playos/AppStore';
import { system } from "./rutile/System";

export function main(): void {
    // Make sure a function is being called
    if (getCallDataSize() < 4) {
        revert(0, 0);
    }

    let ptrSelector = <i32>__alloc(4, 0);
    callDataCopy(ptrSelector, 0, 4);
    let selector = reverseBytes(load<i32>(ptrSelector));

    debug.print32(selector);

    // For now we are going to use fake selectors
    switch(selector) {
        case 0x00000001:
            datasyncSet();
            break;
        case 0x00000002:
            datasyncGet();
            break;
        case 0x550a4063:
            addApplicationToStore();
            break;
        default:
            system.revert('Function does not exist')
    }
}
