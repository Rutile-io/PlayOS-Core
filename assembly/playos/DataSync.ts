import { Console, Process, Environ, FileSystem } from "../wasa";
import safeUnwrapString from "../utils/safeUnwrapString";

export function datasyncGet(key: string): void {
    const environment = new Environ();
    const pathOfValue = safeUnwrapString(environment.get('$HOME')) + '/' + key + safeUnwrapString(environment.get('sender')).replace('0x', '');
    const keyFile = FileSystem.open(pathOfValue, 'r');

    if (keyFile) {
        const value = safeUnwrapString(keyFile.readString());

        // Write to the stdout
        Console.write(value, false);
    } else {
        Console.log('Key does not exist');
        Process.exit(1);
    }
}

/**
 * Sets a storage property by key->value
 *
 * @export
 */
export function datasyncSet(key: string, value: string): void {
    if (!key || !value) {
        Console.error('Key and value is required, received' + key + ':' + value);
        Process.exit(1);
        return;
    }

    const environment = new Environ();
    const pathToWriteTo = safeUnwrapString(environment.get('$HOME')) + '/' + key + safeUnwrapString(environment.get('sender')).replace('0x', '');
    Console.log(pathToWriteTo);
    const keyFile = FileSystem.open(pathToWriteTo, 'xw+');

    if (keyFile) {
        keyFile.writeString(value);
    } else {
        Console.log('We cant write....');
        Process.exit(1);
    }
}
