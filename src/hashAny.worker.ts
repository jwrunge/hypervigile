/*
    THIS MODULE WILL COMPILE TO A WEB WORKER
*/

import { hashAny } from "./hashAny";

onmessage = e=> {
    const hash = hashAny(e.data);
    postMessage(hash);
}