import { printString, print32, printMemHex } from '../utils/debug';

export class Debug {
    print(message: string): void {
        let messageBuffer = String.UTF8.encode(message);
        let ptrMessage = changetype<usize>(messageBuffer);

        printString(ptrMessage, messageBuffer.byteLength);
    }

    print32(value: i32): void {
        print32(value);
    }

    printMemHex(offset: i32, length: i32): void {
        printMemHex(offset, length);
    }
}

export let debug: Debug = new Debug();