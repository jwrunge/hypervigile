function hashStr(input: string): number {
    let hash = 0;
    const enc = new TextEncoder().encode(input);
    for(let char of enc) {
      hash = ((hash << 5) - hash) + char;
      hash &= 0xFFFF; // Convert to usize int
    }
    return hash;
}

export function hashAny(input: any): number {
    let toHash;
    if(Array.isArray(input)) toHash = input;
    else if(input instanceof Map) toHash = Array.from(input.entries());
    else if(input instanceof Set) toHash = Array.from(input);
    else return Date.now();

    return hashStr(JSON.stringify(toHash));
}