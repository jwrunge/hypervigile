import ChangeDetector from "./ChangeDetector";

export default function Fret(ops?: {
    onChange?: (value: any)=> void,
    onIgnore?: ()=> (value: any)=> void,
    onHash?: ()=> void,
}) {
    console.log("RUNNING")
    let worker: Worker | undefined;
    console.log("Creating worker")
    if(globalThis.Worker) {
        const blob = new Blob(["__WORKER__"], {type: "text/javascript"});
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