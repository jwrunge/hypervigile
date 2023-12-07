//@ts-nocheck
// if(typeof input === "string") {
//     console.log("Parsing string");
//     return config.hash(input);
// }
// else if(typeof input !== "object") {
//     console.log("Parsing non-string");
//     return config.hash(input.toString());
// }

// let toHash;
// if(Array.isArray(input)) {
//     toHash = input;
// }
// else if(input instanceof Map) {
//     toHash = Array.from(input.entries());
// }
// else if(input instanceof Set) {
//     toHash = Array.from(input);
// }
// else {
//     console.log("Returning date.now")
//     return Date.now();
// }
// console.log("Hashing array")
// return config.hash(JSON.stringify(toHash));
// }