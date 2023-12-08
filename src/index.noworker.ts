import ChangeDetector from "./ChangeDetector";

export default function(ops?: {
    onChange?: (value: any)=> void,
    onIgnore?: (value: any)=> void,
    onHash?: ()=> void,
}) {
    return new ChangeDetector({
        onchange: ops?.onChange,
        onignore: ops?.onIgnore,
        onhash: ops?.onHash,
    });
}
