/*
    THIS MODULE WILL COMPILE TO A WEB WORKER
*/

onmessage = (e)=> {
    console.log("POSTED")
    console.log(e.data)
    postMessage(e.data);
}