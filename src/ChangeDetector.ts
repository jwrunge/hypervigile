import { hashAny } from "./hashAny";

const NULL_OR_UNDEFINED = -1;
const FORCE_CHECK = -2;

export default class ChangeDetector {
    currentHash: number = FORCE_CHECK;
    currentQuickHash: number = FORCE_CHECK;
    worker?: Worker;
    onValueChanged?: (value: any)=> void;
    onIgnore?: (value: any)=> void;
    onHashing?: ()=> void;

    constructor(
        ops?: {
            onchange?: (value: any)=> void,
            onignore?: (value: any)=> void,
            onhash?: ()=> void,
            worker?: Worker
        }
    ) {
        this.onValueChanged = ops?.onchange;
        this.onHashing = ops?.onhash;
        this.onIgnore = ops?.onignore;
        this.worker = ops?.worker;
    }

    async check(input: any, current: any): Promise<boolean> {
        let requireFullHash = true;
        let quickHash = this.quickHash(input);
        let returnValue = false;

        if(typeof quickHash !== "number") {
            quickHash = quickHash.quick;
            requireFullHash = false;
        }

        //Check quick hash; if difference, callback; if same, require full hash
        if(quickHash !== this.currentQuickHash) {
            returnValue = true;
            this.currentHash = FORCE_CHECK; //Reset full hash - forces full hash on next check
            this.currentQuickHash = quickHash;
            this.onValueChanged?.(input);
        }
        else if(requireFullHash) {
            this.onHashing?.();
            if(this.currentHash === FORCE_CHECK) this.currentHash = await this.hashAny(current);    //If the hash needs to be checked, hash the current value
            const result = await this.hashAny(input);
            if(result !== this.currentHash) {
                returnValue = true;
                this.currentHash = result;
                this.onValueChanged?.(input);
            }
        }
        else {
            this.onIgnore?.(input);
        }

        return returnValue;
    }

    quickHash(input: any): number | { quick: number, full: false } {
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

    async hashAny(input: any): Promise<number> {
        return new Promise((resolve)=> {
            if(this.worker) {
                this.worker.onmessage = e=> {
                    resolve(e.data)
                }
                this.worker.postMessage(input);
            }
            else resolve(hashAny(input));
        });
    }
}