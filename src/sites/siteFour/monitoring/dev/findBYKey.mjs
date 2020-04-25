let data = [
    "time",
    "app",
    "ver",
    "cluster",
    "clusterorg",
    "cloudlet",
    "cloudletorg",
    "apporg",
    "pod",
    "cpu",
    "mem",
    "disk",
    "sendBytes",
    "recvBytes",
    "port",
    "active",
    "handled",
    "accepts",
    "bytesSent",
    "bytesRecvd",
    "P0",
    "P25",
    "P50",
    "P75",
    "P90",
    "P95",
    "P99",
    "P99.5",
    "P99.9",
    "P100"
]


function findIndexByKey(paramKeyName) {
    let result = null;
    for (let index in data) {
        if (paramKeyName.toLowerCase() === data[index].toLowerCase()) {
            result = index;
            break;
        }
    }
    return result;
}


let _result = findIndexByKey('mem')

console.log(`_result===>`, _result);





