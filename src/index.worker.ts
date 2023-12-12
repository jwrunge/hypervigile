import ChangeDetector from "./ChangeDetector";

function Fret() {
    let worker: Worker | undefined;
    if(globalThis.Worker) {
        const blob = new Blob(["__WORKER__"], {type: "text/javascript"});
        const url = URL.createObjectURL(blob);
        worker = new Worker(url);
    }
    return new ChangeDetector(worker);
}

export default Fret;
