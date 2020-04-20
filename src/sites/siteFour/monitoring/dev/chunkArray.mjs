var arr = [
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet2',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet3',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet4',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet5',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet6',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet7',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet8',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet9',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet10',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet11',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet12',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet13',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet14',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudle115',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet16',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet17',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet18',

]

function toChunkArray(myArray, chunkSize) {
    let results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, chunkSize));
    }
    return results;
}

let _result = toChunkArray(arr, 5)

console.log(`sldkflskdflksdlfklsdkfk====>`, _result);
