import { hashAny } from "./hashAny";
const NULL_OR_UNDEFINED = -1;

export default class ChangeDetector {
    #currentHash?: number;
    #currentQuickHash?: number;
    #worker?: Worker;

    constructor(worker?: Worker) {
        this.#worker = worker;
    }

    async check(input: any, current: any): Promise<boolean> {
        const [quickHash, requireFullHash] = this.#quickHash(input) || [];

        console.log("QUICK", quickHash, "CURRENT", this.#currentQuickHash)

        //Check quick hash; if difference, callback; if same, require full hash
        const quickOnly = this.#currentQuickHash !== quickHash;
        this.#currentQuickHash = quickHash;

        if(quickOnly) return true;

        //Only require full hash if the quick hash is the same
        else if(requireFullHash) {
            console.log("Running full hash")
            if(this.#currentHash === undefined) {
                this.#currentHash = await this.#hash(current);    //If the hash needs to be checked, hash the current value
            }
            const result = await this.#hash(input);
            if(result !== this.#currentHash) {
                console.log("UPdating from new hash")
                this.#currentHash = result;
                return true;
            }
        }

        console.log("No change detected")
        return false;
    }

    #quickHash(input: any): [number | undefined, boolean] | undefined {
        //Handle numeric inputs
        let returnValue: number | undefined;

        if(!isNaN(input)) returnValue = input;
        else if(input === true || input === false) returnValue = input ? 1 : 0;
        else if(!input) returnValue = NULL_OR_UNDEFINED;

        if(returnValue !== undefined) return [returnValue, false];

        //Handle complex inputs
        if(input.hasOwnProperty("length")) returnValue = input.length;
        else if(input.hasOwnProperty("size")) returnValue = input.size;
        else returnValue = Object.keys(input).length;

        return [returnValue, true];
    }

    async #hash(input: any): Promise<number> {
        if(this.#worker) {
            return new Promise((resolve)=> {
                const channel = new MessageChannel();
                channel.port1.onmessage = ({data})=> resolve(data);
                this.#worker?.postMessage(input, [channel.port2]);
            });
        }
        return hashAny(input);
    }
}