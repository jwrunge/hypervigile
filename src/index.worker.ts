import ChangeDetector from "./ChangeDetector";

export default function Fret(ops?: {
    onChange?: (value: any)=> void,
    onIgnore?: ()=> (value: any)=> void,
    onHash?: ()=> void,
}) {
    let worker: Worker | undefined;
    if(globalThis.Worker) {
        const blob = new Blob(["__WORKER__"], {type: "text/javascript"});
        const url = URL.createObjectURL(blob);
        worker = new Worker(url);
    }
    return new ChangeDetector({
        onchange: ops?.onChange,
        onignore: ops?.onIgnore,
        onhash: ops?.onHash,
        worker
    });
}