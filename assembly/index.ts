import { Console, FileSystem, Environ, CommandLine, Process } from './wasa';

export function _start(): void {
    const command = new CommandLine();

    if (!command.args.length) {
        Console.log('Function argument should be available');
        Process.exit(1);
    }

    command.all().forEach((x) => {
        Console.log(x);
    });

    Console.log('Hello Bitches');
}
