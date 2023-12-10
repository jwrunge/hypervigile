/*
    THIS MODULE WILL COMPILE TO A WEB WORKER
*/

import { hashAny } from "./hashAny";

onmessage = e=> {
    postMessage(hashAny(e.data));
}