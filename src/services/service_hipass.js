//import axios from 'axios';
//import fetchJsonp from 'fetch-jsonp';
import axios from 'axios-jsonp-pro';
import FormatHipassMonitor from './formatter/formatHipassMonitor';
import FormatHipassMonitorTraffic from './formatter/formatHipassMonitorTraffic';
//import FormatHipassMonitorLane from './formatter/formatHipassMonitorLane';
import FormatLaneEquip from './formatter/formatLaneEquip';
import FormatLaneGather from './formatter/formatLaneGather';

//let gUrl = 'http://121.78.87.232:8080/station/';
//let gUrl = 'http://211.195.163.17:8080/station/';
let gUrl = 'http://192.168.10.42:8080/station/';
/*
신공항    : 097 <Integer>
북인천    : 098 <Integer>
청라      : 099 <Integer>
전체      : ALL <Integer>
*/
let areaCode = ['097', '098', '099', 'ALL'];

/*

*/

let siteAddress = {
    hipassMonitor: 'hipassDashboard.do?method=getLaneStatInfos',
    trafficStatus: 'hipassDashboard.do?method=getTrafficHourInfos',
    laneEquipEventInfoList: 'hipassDashboard.do?method=getLaneEquipEventInfoList',
    laneGatherEventInfoList: 'hipassDashboard.do?method=getLaneGatherEventInfoList',



    cardStatInfos:'hipassDashboard.do?method=getCardStatInfos',//카드관리현황
    cardBLStatInfoList:'hipassDashboard.do?method=getCardBLStatInfoList',//교통카드별 B/L현황

    bridgeWeatherInfos:'hipassDashboard.do?method=getBridgeWeatherInfos'//기상정보
}
/////////////////
// 로컬 환경에서 테스트 하기 위함
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
export function getHipassMonitor(resource, state, callback, every) {
    console.log('request data as global area code == '+global.areaCode)
    let url = getUrl(resource);
    axios.jsonp(url)
            .then(function (response) {
                console.log('axios json p == '+JSON.stringify(response));
                let responseData = FormatHipassMonitor(response)
                callback(responseData);

            })
            .catch(function (error) {
                console.log('axios json p error == '+error);

            });

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
