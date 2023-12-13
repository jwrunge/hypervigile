export function hashAny(input: any): number {
    let hash = 0, toHash = input;
    if(input.hasOwnProperty("entries")) toHash = Array.from(input.entries());
    else if(Array.isArray(input)) toHash = Array.from(input);
    else toHash = JSON.stringify(input);

    for(let char of new TextEncoder().encode(toHash)) {
      hash = ((hash << 5) - hash) + char;
      hash &= 0xFFFF; // Convert to usize int
    }
    return hash;
}