//import axios from 'axios';
//import fetchJsonp from 'fetch-jsonp';
import axios from 'axios-jsonp-pro';
import FormatHipassMonitor from './formatter/formatHipassMonitor';
import FormatHipassMonitorTraffic from './formatter/formatHipassMonitorTraffic';
import FormatHipassMonitorLane from './formatter/formatHipassMonitorLane';

import FormatOfficeTraffic from './formatter/formatOfficeTraffic'
import FormatCollectwayTraffic from './formatter/formatCollectwayTraffic'
import FormatInoutwayTraffic from './formatter/formatInoutwayTraffic'

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
    officeTrafficInfos:'hipassDashboard.do?method=getOfficeTrafficInfos',//영업소별 교통량
    collectWayTrafficInfos:'hipassDashboard.do?method=getCollectWayTrafficInfos',//장수수단별 교통량
    inoutWayTrafficInfos:'hipassDashboard.do?method=getInoutWayTrafficInfos',//진출입로 교통량
}

function getUrl(resource) {
    let area = '';
    switch(global.areaCode.mainPath) {
        case '/site1': area = areaCode[0]; break;
        case '/site2': area = areaCode[1]; break;
        case '/site3': area = areaCode[2]; break;
    }
    return gUrl+siteAddress[resource]+'&officeNum='+area;
}
export function getOfficeTrafficInfos(resource, hId, callback, every) {
    console.log('request data as global area code == '+global.areaCode.mainPath)
    axios.jsonp(getUrl(resource))
            .then(function (response) {
                console.log('axios json p getOfficeTrafficInfos == '+JSON.stringify(response));
                let responseData = null;
                if (resource === 'officeTrafficInfos') responseData = FormatOfficeTraffic(response);
                if (resource === 'collectWayTrafficInfos') responseData = FormatCollectwayTraffic(response);
                if (resource === 'inoutWayTrafficInfos') responseData = FormatInoutwayTraffic(response);
                callback(responseData);

            })
            .catch(function (error) {
                console.log('axios json p error == '+error);

            });


}
export function getInoutWayTrafficInfos(resource, hId, callback, every) {
    console.log('request data as global area code == '+global.areaCode.mainPath)

    axios.jsonp(getUrl(resource))
            .then(function (response) {
                console.log('axios json p getInoutWayTrafficInfos == '+JSON.stringify(response));
                let responseData = null;
                responseData = FormatInoutwayTraffic(response);
                callback(responseData);

            })
            .catch(function (error) {
                console.log('axios json p error getInoutWayTrafficInfos == '+error);

            });



}
