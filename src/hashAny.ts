export function hashAny(input: any): number {
    let hash = 0, toHash = input;
    if(input instanceof Map) toHash = Array.from(input.entries());
    else if(input instanceof Set) toHash = Array.from(input);

    for(let char of new TextEncoder().encode(toHash)) {
      hash = ((hash << 5) - hash) + char;
      hash &= 0xFFFF; // Convert to usize int
    }
    return hash;
}