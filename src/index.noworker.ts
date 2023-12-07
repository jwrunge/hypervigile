import ChangeDetector from "./ChangeDetector";

export default function(ops?: {
    onChange?: (value: any)=> void,
    onIgnore?: ()=> (value: any)=> void,
    onHash?: ()=> void,
}) {
    return new ChangeDetector({
        onValueChanged: ops?.onChange,
        onIgnore: ops?.onIgnore,
        onHashing: ops?.onHash
    });
}