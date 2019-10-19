import { u256 } from "../../../node_modules/bignum/assembly/integer/u256";
import { print32 } from "../../utils/debug";

export default function toAddress(address: u256): u8[] {
    const bytes = address.toBytes(true);
    return bytes.slice(12, 32);
}

export function toAddressPointer(address: u256): i32 {
    const arr = toAddress(address);
    const ptr = changetype<usize>(arr.dataStart);

    return ptr;
}