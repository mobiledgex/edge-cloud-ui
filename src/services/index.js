//import axios from 'axios';
//import fetchJsonp from 'fetch-jsonp';
import axios from 'axios-jsonp-pro';
import FormatHipassMonitorTraffic from './formatter/formatCPUMEMUsage';
import FormatLaneEquip from './formatter/formatLaneEquip';
import FormatLaneGather from './formatter/formatLaneGather';
import FormatCPUMEMUsage from './formatter/formatCPUMEMUsage';
import FormatNetworkIO from './formatter/formatNetworkIO';

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
*/

let siteAddress = {
    cpuUsage: '100%20-%20(avg%20by%20(instance)%20(irate(node_cpu_seconds_total%7Bjob%3D%22prometheus%22%2Cmode%3D%22idle%22%7D%5B5m%5D))%20*%20100)',
    memoryUsage: '100%20-%20((node_memory_MemAvailable_bytes%7Bjob%3D%22prometheus%22%7D%20*%20100)%20%2F%20node_memory_MemTotal_bytes%7Bjob%3D%22prometheus%22%7D)',
    networkTraffic_recv: 'sum%20(irate(node_network_receive_packets_total%7Bjob%3D%22prometheus%22%7D%5B5m%5D))%20by%20(instance)',
    networkTraffic_send: 'sum%20(irate(node_network_transmit_packets_total%7Bjob%3D%22prometheus%22%7D%5B5m%5D))%20by%20(instance)',

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
export function getStatusCPU(callback, every) {
    console.log('request data as global area code == '+global.areaCode)
    let url = gUrl + siteAddress.cpuUsage;
    var start = () => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let responseData = FormatCPUMEMUsage(data)
                callback(responseData);
            });
    }

    if(every) {
        let loop =()=> {
            start();
            setTimeout(()=>loop(), every)
        }
        loop();
    } else {
        start();
    }

}
export function getStatusMEM(callback, every) {
    console.log('request data as global area code == '+global.areaCode)
    let url = gUrl + siteAddress.memoryUsage;

    var start = () => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let responseData = FormatCPUMEMUsage(data)
                callback(responseData);
            });
    }

    if(every) {
        let loop =()=> {
            start();
            setTimeout(()=>loop(), every)
        }
        loop();
    } else {
        start();
    }
}
export function getStatusNET(callback, every) {

    let url1 = gUrl + siteAddress.networkTraffic_recv;
    let url2 = gUrl + siteAddress.networkTraffic_send;
    let responseData1 = null, responseData2 = null
    console.log('network url == ', url1, url2)

    const start = () => {
        fetch(url1)
            .then(response => response.json())
            .then(data1 => {
                responseData1 = FormatNetworkIO(data1)
                if(responseData1 && responseData2){
                    console.log('res data 1-- '+responseData1)
                    callback(responseData1, responseData2);
                }

            });
        fetch(url2)
            .then(response => response.json())
            .then(data2 => {
                responseData2 = FormatNetworkIO(data2)
                if(responseData1 && responseData2){
                    console.log('res data 2-- '+responseData2)
                    callback(responseData1, responseData2);
                }
            });
    }

    if(every) {
        let loop =()=> {
            responseData1 = null;
            responseData2 = null;
            start();
            setTimeout(()=>loop(), every)
        }
        loop();
    } else {
        start();
    }
}
let ajaxcall1= null;
export function getTrafficData(resource, hId, callback, every) {
    let url = getUrl(resource);
    console.log('request data as global area code == '+global.areaCode)
    axios.jsonp(url)
            .then(function (response) {
                console.log('axios json p == ' + JSON.stringify(response));
                let responseData = FormatHipassMonitorTraffic(response);
                callback(responseData);

            })
            .catch(function (error) {
                console.log('axios json p error == ' + error);
            });

}

let ajaxcall2 = null;
export function getLaneEquipData(resource, hId, callback, every) {
    console.log('request data as global area code == '+global.areaCode)
    let url = getUrl(resource);
    axios.jsonp(url)
            .then(function (response) {
                console.log('axios json p lane equip data == ' + JSON.stringify(response));
                let responseData = FormatLaneEquip(response);
                callback(responseData);

            })
            .catch(function (error) {
                console.log('axios json p error == ' + error);
            });
}


export function getLaneEquipEventInfoList(resource, hId, callbackOne, every) {
    let url = getUrl(resource);
    axios.jsonp(url)
            .then(function (response) {
                console.log('axios json p == ' + JSON.stringify(response));
                let responseData = FormatLaneEquip(response);
                callbackOne(responseData);
            })
            .catch(function (error) {
                console.log('axios json p error equip== ' + error);
            });


}

export function getLaneGatherEventInfoList(resource, hId, callbackTwo, every) {
    let url = getUrl(resource);
    axios.jsonp(url)
            .then(function (response) {
                console.log('axios json p == ' + JSON.stringify(response));
                let responseData = FormatLaneGather(response);
                callbackTwo(responseData);

            })
            .catch(function (error) {
                console.log('axios json p error gather== ' + error);
            });
}

export function getFakeData(resource, hId, callback, every) {
    let area = '';
    switch(global.areaCode.mainPath) {
        case '/site1': area = areaCode[0]; break;
        case '/site2': area = areaCode[1]; break;
        case '/site3': area = areaCode[2]; break;
    }

    const ajaxcall = () => axios.get('http://localhost:3004/'+resource).then(response => {
        ajaxcall._callback(response.data);
        (every) ? setTimeout(ajaxcall, 1000*every) : setTimeout(ajaxcall, 1000*60);
    });
    ajaxcall._callback = callback;
    setTimeout(ajaxcall, 100);
}
export function getFakeData2(resource, hId, callback, every) {
    let area = '';
    switch(global.areaCode.mainPath) {
        case '/site1': area = areaCode[0]; break;
        case '/site2': area = areaCode[1]; break;
        case '/site3': area = areaCode[2]; break;
    }

    const ajaxcall = () => axios.get('http://localhost:3004/'+resource).then(response => {
        ajaxcall._callback(response.data);
        (every) ? setTimeout(ajaxcall, 1000*every) : setTimeout(ajaxcall, 1000*60);
    });
    ajaxcall._callback = callback;
    setTimeout(ajaxcall, 100);
}
export function getBridgeWeatherInfos(resource, hId, callback, every) {
    let area = '';
    switch(global.areaCode.mainPath) {
        case '/site1': area = areaCode[0]; break;
        case '/site2': area = areaCode[1]; break;
        case '/site3': area = areaCode[2]; break;
    }

    let page = '';


    let url = gUrl+siteAddress[resource]+'&officeNum='+area;
    let ajaxcall = () => axios.jsonp(url)
    .then(function (response) {
        console.log('axios json p == '+JSON.stringify(response));
        //let responseData = FormatBridgeWeather(response)
        ajaxcall._callback(response);
        (every) ? setTimeout(ajaxcall, 1000*every) : setTimeout(ajaxcall, 1000*60);
    })
    .catch(function (error) {
        console.log('axios json p error == '+error);
    });
    ajaxcall._callback = callback;
    setTimeout(ajaxcall, 100);
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
    .then(function (response) {
        console.log(JSON.stringify(response));
        callback(response)
    })
    .catch(function (error) {
        console.log(error);
    });
}
