/*
    THIS MODULE WILL COMPILE TO A WEB WORKER
*/

onmessage = (e)=> {
    postMessage(e.data);
}