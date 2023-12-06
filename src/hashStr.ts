export default async function hashStr(input: string): Promise<number> {
    let hash = 0;
    const enc = new TextEncoder().encode(input);
    for(let char of enc) {
      hash = ((hash << 5) - hash) + char;
      hash &= 0xFFFF; // Convert to usize int
    }
    return hash;
}