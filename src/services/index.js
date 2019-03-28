
import axios from 'axios-jsonp-pro';
import Influx from 'influx';

import FormatCPUMEMUsage from './formatter/formatCPUMEMUsage';
import FormatNetworkIO from './formatter/formatNetworkIO';
import FormatFILEUsage from './formatter/formatFILEUsage';

let gUrl = 'http://dashboard.mobiledgex.net:9090/api/v1/query?query=';

/*
신공항    : 097 <Integer>
북인천    : 098 <Integer>
청라      : 099 <Integer>
전체      : ALL <Integer>
*/
let areaCode = ['097', '098', '099', 'ALL'];

/*
http://dashboard.mobiledgex.net:9090/api/v1/query?query=sum%20(irate(node_network_receive_packets_total%7Bjob%3D%22prometheus%22%7D%5B5m%5D))%20by%20(instance)
http://dashboard.mobiledgex.net:9090/api/v1/query?query=sum%20(irate(node_network_transmit_packets_total%7Bjob%3D%22prometheus%22%7D%5B5m%5D))%20by%20(instance)

curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/operator" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/app" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/appinst" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/developer" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cluster" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
*/

let siteAddress = {
    cpuUsage: '100%20-%20(avg%20by%20(instance)%20(irate(node_cpu_seconds_total%7Bjob%3D%22prometheus%22%2Cmode%3D%22idle%22%7D%5B5m%5D))%20*%20100)',
    memoryUsage: '100%20-%20((node_memory_MemAvailable_bytes%7Bjob%3D%22prometheus%22%7D%20*%20100)%20%2F%20node_memory_MemTotal_bytes%7Bjob%3D%22prometheus%22%7D)',
    networkTraffic_recv: 'sum%20(irate(node_network_receive_packets_total%7Bjob%3D%22prometheus%22%7D%5B5m%5D))%20by%20(instance)',
    networkTraffic_send: 'sum%20(irate(node_network_transmit_packets_total%7Bjob%3D%22prometheus%22%7D%5B5m%5D))%20by%20(instance)',
    filesystemUsage: '100%20-%20((node_filesystem_avail_bytes%7Bmountpoint%3D%22%2F%22%2Cfstype!%3D%22rootfs%22%7D%20*%20100)%20%2F%20node_filesystem_size_bytes%7Bmountpoint%3D%22%2F%22%2Cfstype!%3D%22rootfs%22%7D)'
}


/////////////////
// below script is just test on local
/////////////////
// export function getHipassMonitor(resource, hId, callback, every) {
//     console.log('request data as global area code == '+global.areaCode)
//     let area = '';
//     switch(gobal.areaCode) {
//         case '/site1': area = areaCode[0]; break;
//         case '/site2': area = areaCode[1]; break;
//         case '/site3': area = areaCode[2]; break;
//     }
//     let ajaxcall = () => axios.get('http://localhost:3004/'+resource).then(response => {
//         callback(response.data);
//         //if(every) setTimeout(ajaxcall, 1000*every);
//     });
//     setTimeout(ajaxcall, 100);
// }

let services = {};
function getUrl(resource) {
    let area = '';
    switch(global.areaCode.mainPath) {
        case '/site1': area = areaCode[0]; break;
        case '/site2': area = areaCode[1]; break;
        case '/site3': area = areaCode[2]; break;
    }
    services.currentSite = global.areaCode.mainPath;
    return gUrl+siteAddress[resource]+'&officeNum='+area;
}


let ajaxcall0 = null;
export function getStatusCPU(callback, every, stop) {
    //console.log('request data as global area code == '+global.areaCode)
    let url = gUrl + siteAddress.cpuUsage;
    let responseData = null
    var start = () => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                responseData = FormatCPUMEMUsage(data)
                callback(responseData);
            });
    }

    //start();

    axios.jsonp(url)
        .then(response => response.json())
        .then(function (response) {
            responseData = FormatCPUMEMUsage(response)
            callback(response)
        })
        .catch(function (error) {
            console.log(error);
        });

}
export function getStatusMEM(callback, every, stop) {
    //console.log('request data as global area code == '+global.areaCode)
    let url = gUrl + siteAddress.memoryUsage;
    let responseData = null
    var start = () => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                responseData = FormatCPUMEMUsage(data)
                callback(responseData);
            });
    }
    //start();

    axios.jsonp(url)
        .then(response => response.json())
        .then(function (response) {
            responseData = FormatCPUMEMUsage(response)
            callback(response)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function getStatusNET(callback, every, stop) {

    let url1 = gUrl + siteAddress.networkTraffic_recv;
    let url2 = gUrl + siteAddress.networkTraffic_send;
    let responseData1 = null, responseData2 = null
    //console.log('network url == ', url1, url2)

    const start = () => {
        if(stop){
            return;
        }
        fetch(url1)
            .then(response => response.json())
            .then(data1 => {
                responseData1 = FormatNetworkIO(data1)
                if(responseData1 && responseData2){
                    //console.log('res data 1-- '+responseData1)
                    callback(responseData1, responseData2);
                }

            });
        fetch(url2)
            .then(response => response.json())
            .then(data2 => {
                responseData2 = FormatNetworkIO(data2)
                if(responseData1 && responseData2){
                    //console.log('res data 2-- '+responseData2)
                    callback(responseData1, responseData2);
                }
            });
    }
    //start();

}
export function getStatusFilesys(callback, every, stop) {
    //console.log('request data as global area code == '+global.areaCode)
    let url = gUrl + siteAddress.filesystemUsage;
    let responseData = null
    var start = () => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                responseData = FormatFILEUsage(data)
                callback(responseData);
            });
    }
    //start();

    axios.jsonp(url)
        .then(response => response.json())
        .then(function (response) {
            responseData = FormatFILEUsage(response)
            callback(response)
        })
        .catch(function (error) {
            console.log(error);
        });
}
//////////////////////////////////
// curl -X POST...
/*
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/operator" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/app" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/appinst" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/developer" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cluster" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
*/
//////////////////////////////////
let postUrl = 'https://mexdemo.ctrl.mobiledgex.net:36001/show/';

export function getComputService() {


}

export function getPublicAccountKey(resource, rId, callback) {

    let url = gUrl+resource;

    ///////////// Fetch
    //https://github.com/camsong/fetch-jsonp
    // fetchJsonp(url, {
    //     jsonpCallback: 'callback',
    // })
    // .then(function(response) {
    //     return response.json()
    // }).then(function(json) {
    //     console.log('parsed json', json)
    //     callback(json)
    // }).catch(function(ex) {
    //     console.log('parsing failed', ex)
    // })

    ///////////// Axios
    //https://www.npmjs.com/package/axios-jsonp-pro
    axios.jsonp(url)
        .then(response => response.json())
    .then(function (response) {
        console.log('axios json p == '+JSON.stringify(response));
        callback(response)
    })
    .catch(function (error) {
        console.log('axios json p error == '+error);
    });



}

export function postUserAccount(resource, userInfo, callback) {
    let url = gUrl+resource+'&securedUserid='+userInfo.securedUserid+'&securedPasswd='+userInfo.securedPasswd;
    let params = {
        securedUserid: userInfo.securedUserid,
        securedPasswd: userInfo.securedPasswd,
        headers:{
            'Acces-Control-Allow-Origin': '*'
        }
    };

    axios.jsonp(url, params)
        .then(response => response.json())
    .then(function (response) {
        console.log(JSON.stringify(response));
        callback(response)
    })
    .catch(function (error) {
        console.log(error);
    });
}
export function getLoginStatus(resource, callback) {
    let url = gUrl+resource;

    axios.jsonp(url)
        .then(response => response.json())
    .then(function (response) {
        console.log(JSON.stringify(response));
        callback(response)
    })
    .catch(function (error) {
        console.log(error);
    });
}
