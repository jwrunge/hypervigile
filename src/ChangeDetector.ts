const NULL_OR_UNDEFINED = -1;
const FORCE_CHECK = -2;
const UNKNOWN_HASH = -3;

export default class ChangeDetector {
    #currentHash: number = -1;
    #currentQuickHash: number = -1;
    #worker?: Worker;
    #onValueChanged?: (value: any)=> void;
    #onIgnore?: (value: any)=> void;
    #onHashing?: ()=> void;

    constructor(
        ops?: {
            onValueChanged?: (value: any)=> void,
            onIgnore?: (value: any)=> void,
            onHashing?: ()=> void,
            worker?: Worker
        }
    ) {
        this.#onValueChanged = ops?.onValueChanged;
        this.#onHashing = ops?.onHashing;
        this.#onIgnore = ops?.onIgnore;
        this.#worker = ops?.worker;
        
        if(globalThis.Worker) {
            this.#worker?.postMessage("Hello from main thread");
        }
    }

    check(input: any) {
        let requireFullHash = true;
        let quickHash = this.#quickHash(input);
        if(typeof quickHash !== "number") {
            quickHash = quickHash.quick;
            requireFullHash = false;
        }

        //Check quick hash; if difference, callabck; if same, require full hash
        if(quickHash !== this.#currentQuickHash) {
            this.#onValueChanged?.(input);
        }
        else if(requireFullHash) {
            this.#onHashing?.();
            this.#hashAny(input).then(result=> {
                if(result !== this.#currentHash) {
                    this.#onValueChanged?.(input);
                }
            })
        }
        else {
            this.#onIgnore?.(input);
        }

        //Handle hash updates
        this.#currentQuickHash = quickHash;
        if(!requireFullHash) this.#currentHash = quickHash;
    }

    #quickHash(input: any): number | { quick: number, full: false } {
        //Handle numeric inputs
        if(input === null || input === undefined) return {quick: NULL_OR_UNDEFINED, full: false};
        if(input === true || input === false) {
            const res = input ? 1 : 0;
            return {quick: res, full: false};
        }
        if(!isNaN(input)) return {quick: input, full: input};

        //Handle complex inputs
        if(typeof input === "string" || Array.isArray(input)) return input.length;
        if(input instanceof Map || input instanceof Set) return input.size;
        return FORCE_CHECK;
    }

    async #hashAny(input: any): Promise<number> {
        if(this.#worker) {

        }

        else {

        }

        return new Promise(resolve=> resolve(UNKNOWN_HASH));
    }
}