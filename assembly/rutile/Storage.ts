import "rt";
import { storageStore, storageLoad } from "../utils/env";
import StringMemory from "./utils/StringMemory";

export class Storage {

    /**
     * Stores a string to the given location
     *
     * @param {string} key
     * @param {string} value
     * @memberof Storage
     */
    setItem(key: string, value: string): void {
        const keyMemory = new StringMemory(key);
        const valueMemory = new StringMemory(value);

        // TODO: Key should be hashed before stored.
        storageStore(keyMemory.pointer, valueMemory.pointer, keyMemory.length, valueMemory.length);
    }

    /**
     * Gets the value from storage
     * TODO: Some values are much larger than 32 bytes. We should support those
     *
     * @param {string} key
     * @returns {string}
     * @memberof Storage
     */
    getItem(key: string): string {
        const keyMemory = new StringMemory(key);
        let ptrValue = __alloc(32, 0);
        storageLoad(keyMemory.pointer, ptrValue);

        return '';
        // load<ArrayBuffer>(ptrValue);
        
        // return String.fromUTF8(ptrValue, 32);
    }
}

export let storage: Storage = new Storage();
