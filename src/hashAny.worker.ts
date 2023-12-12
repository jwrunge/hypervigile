/*
    THIS MODULE WILL COMPILE TO A WEB WORKER
*/

import { hashAny } from "./hashAny";
onmessage = e=> e.ports[0].postMessage(hashAny(e.data));