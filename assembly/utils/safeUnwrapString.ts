/**
 * Assemblyscript has a weird bug when using early returns
 * this method bypasses that in a more "clean" way
 *
 * @export
 * @param {(string | null)} s
 * @returns {string}
 */
export default function safeUnwrapString(s: string | null): string {
    if (s) {
        return s;
    } else {
        return '';
    }
}
