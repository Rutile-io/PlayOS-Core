const WASI = require("@wasmer/wasi").WASI;
const WasmFs = require("@wasmer/wasmfs").WasmFs;
const fs = require('fs');

async function run() {
    const wasmFs = new WasmFs();
    let wasi = new WASI({
        args: [
            '0x00000001',
        ],
        env: {},
        bindings: {
          ...WASI.defaultBindings,
          fs: wasmFs.fs
        }
    });

    const file = fs.readFileSync('./build/untouched.wasm');
    let { instance } = await WebAssembly.instantiate(file, {
        env: {
            abort: () => {
                console.log('abort');
            }
        },
        wasi_unstable: wasi.wasiImport,
    });

    console.log('Before run');
    try {
        wasi.start(instance);
    } catch (err) {
        console.log('Afterr run', err);
    }

    const stdout = await wasmFs.getStdOut();
    console.log('[] stdout -> ', stdout);
}

run();
