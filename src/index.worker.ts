import ChangeDetector from "./ChangeDetector";
//@ts-ignore
import HASH_WORKER from "inline!./hashAny.worker.ts";

export default function(ops?: {
    onChange?: (value: any)=> void,
    onIgnore?: ()=> (value: any)=> void,
    onHash?: ()=> void,
}) {
    let worker: Worker | undefined;
    console.log("Creating worker")
    if(globalThis.Worker) {
        const blob = new Blob([HASH_WORKER], {type: "text/javascript"});
        const url = URL.createObjectURL(blob);
        worker = new Worker(url);
        console.log("Worker created", worker);
    }
    return new ChangeDetector({
        onchange: ops?.onChange,
        onignore: ops?.onIgnore,
        onhash: ops?.onHash,
        worker
    });
}
