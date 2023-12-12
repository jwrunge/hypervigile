import { hashAny } from "./hashAny";

const NULL_OR_UNDEFINED = -1;
const FORCE_CHECK = -2;

export default class ChangeDetector {
    currentHash: number = FORCE_CHECK;
    currentQuickHash: number = FORCE_CHECK;
    worker?: Worker;
    changed?: (value: any)=> void;
    onIgnore?: (value: any)=> void;
    hashing?: ()=> void;

    constructor(
        ops?: {
            onchange?: (value: any)=> void,
            onignore?: (value: any)=> void,
            onhash?: ()=> void,
            timeout?: number,
            worker?: Worker
        }
    ) {
        this.changed = ops?.onchange;
        this.hashing = ops?.onhash;
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
            this.changed?.(input);
        }
        else if(requireFullHash) {
            this.hashing?.();
            if(this.currentHash === FORCE_CHECK) this.currentHash = await this.hash(current);    //If the hash needs to be checked, hash the current value
            const result = await this.hash(input);
            if(result !== this.currentHash) {
                returnValue = true;
                this.currentHash = result;
                this.changed?.(input);
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
        if(input === true || input === false) return {quick: input ? 1 : 0, full: false};
        if(!isNaN(input)) return {quick: input, full: input};

        //Handle complex inputs
        if(typeof input === "string" || Array.isArray(input)) return input.length;
        if(input instanceof Map || input instanceof Set) return input.size;
        return FORCE_CHECK;
    }

    async hash(input: any): Promise<number> {
        if(this.worker) {
            return new Promise((resolve)=> {
                const channel = new MessageChannel();

                channel.port1.onmessage = ({data})=> {
                    resolve(data);
                }

                this.worker?.postMessage(input, [channel.port2]);
            })
        }
        return hashAny(input);
    }
}