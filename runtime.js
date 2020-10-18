const WASI = require("@wasmer/wasi").WASI;
const WasmFs = require("@wasmer/wasmfs").WasmFs;
const fs = require('fs');
const wasmTransformer = require("@wasmer/wasm-transformer");

async function run() {
    const wasmFs = new WasmFs();
    const homeFolder = '/home/0x00000200002000002000200';

    wasmFs.fs.mkdirSync(homeFolder, {
        recursive: true,
    });

    let wasi = new WASI({
        preopenDirectories: {
            '/': '/',
            [homeFolder]: homeFolder,
        },
        args: [
            'WASM',
            '0x00000001',
            '0x47287f343f',
            '0x555555343f',
        ],
        env: {
            'sender': '0x23213213543543234234223423423',
            'gas_left': 1,
            '$HOME': homeFolder,
        },
        bindings: {
          ...WASI.defaultBindings,
          fs: wasmFs.fs
        }
    });

    const file = fs.readFileSync('./build/untouched.wasm');
    const loweredBinary = await wasmTransformer.lowerI64Imports(file);
    let { instance } = await WebAssembly.instantiate(loweredBinary, {
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

    const x = wasmFs.fs.readdirSync('/home');
    console.log('[] x -> ', x);

    const fileResult = wasmFs.fs.readFileSync(homeFolder + '/0x47287f343f');
    console.log('[] fileResult -> ', fileResult.toString());
}

run();
