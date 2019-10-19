class Map {
    private prefix: string;
    private mapLength: number = 0;

    constructor(prefix: string) {
        // TODO: Should be keccak256 hashed
        this.prefix = prefix;
    }

    get length() {
        return this.mapLength;
    }

    get size() {
        return this.mapLength;
    }

    get(key: string) {
        
    }
}

export default Map;