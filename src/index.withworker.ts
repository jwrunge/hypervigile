import ChangeDetector from "./ChangeDetector";
import HashWorker from "./hashAny.worker.ts?worker&inline";

export default function(ops?: {
    onChange?: (value: any)=> void,
    onIgnore?: ()=> (value: any)=> void,
    onHash?: ()=> void,
}) {
    const worker = new HashWorker();
    return new ChangeDetector({
        onValueChanged: ops?.onChange,
        onIgnore: ops?.onIgnore,
        onHashing: ops?.onHash,
        worker
    });
}