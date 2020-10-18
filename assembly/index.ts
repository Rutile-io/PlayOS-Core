import { Console, FileSystem, Environ, CommandLine, Process } from './wasa';
import { datasyncSet, datasyncGet } from './playos/DataSync';
import safeUnwrapString from './utils/safeUnwrapString';

export function abort(
    message: string | null = '',
    fileName: string | null = '',
    lineNumber: u32 = 0,
    columnNumber: u32 = 0,
  ): void {
    if (message) {
        Console.log('message: ' + message + '\n');
    }

    if (fileName) {
        Console.log('fileName: ' + fileName + '\n');
    }

    Console.log('l: ' + lineNumber.toString() + '\n');
    Console.log('c: ' + columnNumber.toString() + '\n');

    Process.exit(1);
}

export function _start(): void {
    const command = new CommandLine();

    if (!command.args.length) {
        Console.log('Function argument should be available');
        Process.exit(1);
    }

    let funcId = safeUnwrapString(command.get(1));

    if (funcId == '0x00000001') {
        datasyncSet(safeUnwrapString(command.get(2)), safeUnwrapString(command.get(3)));
    } else if (funcId == '0x00000002') {
        datasyncGet(safeUnwrapString(command.get(2)));
    } else {
        Console.log('Function id not found');
    }

    Process.exit(0);
}
