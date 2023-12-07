/*
    THIS MODULE WILL COMPILE TO A WEB WORKER
*/

import hashAny from "./hashAny";

onmessage = e=> {
    hashAny(e.data).then((res)=> {
        postMessage(res);
    });
}