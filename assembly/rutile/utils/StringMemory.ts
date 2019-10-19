import { printMemHex, printString } from "../../utils/debug";

class StringMemory {

    public length: i32;
    public pointer: i32;

    constructor(str: string) {
        const buffer = String.UTF8.encode(str);
        this.pointer = changetype<usize>(buffer);
        this.length = buffer.byteLength;

        printString(this.pointer, this.length);
        printMemHex(this.pointer, this.length);

        // Might need to __retain and __release
        // https://github.com/AssemblyScript/assemblyscript/pull/679
    }

    fromPtr(): string {
        return '';
    }
}

export default StringMemory;