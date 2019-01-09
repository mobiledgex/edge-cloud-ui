//getThermoHygrostatInfos
/*
#-----------------------------------
# FMS Dashboard
#  - key = Location
#-----------------------------------
dashboard.headoffice.main=HIWAY_652
dashboard.headoffice.sub=HIWAY_653
dashboard.incheonairport.main=HIWAY_651
dashboard.incheonairport.sub=HIWAY_650
dashboard.northincheon.main=HIWAY_654
dashboard.northincheon.sub=HIWAY_655
 */

import axios from 'axios-jsonp-pro';


import FormatThemoHygrostat from './formatter/formatThermoHygrostat';
import FormatUPSBettery from './formatter/formatUpsBattery';
import FormatUPSStatus from './formatter/formatUpsStatus';

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
    thermoHygrostatInfos:'hipassDashboard.do?method=getThermoHygrostatInfos',
    upsBatteryStatusInfos:'hipassDashboard.do?method=getUpsBatteryStatusInfos',
    upsStatusInfos:'hipassDashboard.do?method=getUpsStatusInfos'
}

export function getUpsStatusInfos(resource, hId, callback, every) {
    console.log('request data as global area code == '+global.areaCode.mainPath)
    let area = '';
    switch(global.areaCode.mainPath) {
        case '/site1': area = areaCode[0]; break;
        case '/site2': area = areaCode[1]; break;
        case '/site3': area = areaCode[2]; break;
    }

    let url = gUrl+siteAddress[resource]+'&officeNum='+area;
    let ajaxcall = () => axios.jsonp(url)
        .then(function (response) {
            console.log('axios json p getUpsStatusInfos == '+JSON.stringify(response));
            let responseData = null;
            responseData = FormatUPSStatus(response);

            ajaxcall._callback(responseData);
            console.log('getOfficeTrafficInfos---'+global.areaCode.subPath)
            if(global.areaCode.subPath === 'pg=0'){
                (every) ? setTimeout(ajaxcall, 1000*every) : setTimeout(ajaxcall, 1000*60);
            }
        })
        .catch(function (error) {
            console.log('axios json p error == '+error);
            if(global.areaCode.subPath === 'pg=0'){
                (every) ? setTimeout(ajaxcall, 1000*every) : setTimeout(ajaxcall, 1000*60);
            }
        });

    ajaxcall._callback = callback;
    setTimeout(ajaxcall, 100);
}
export function getThermoHygrostatInfos(resource, hId, callback, every) {
    console.log('request data as global area code == '+global.areaCode.mainPath)
    let area = '';
    switch(global.areaCode.mainPath) {
        case '/site1': area = areaCode[0]; break;
        case '/site2': area = areaCode[1]; break;
        case '/site3': area = areaCode[2]; break;
    }

    let url = gUrl+siteAddress[resource]+'&officeNum='+area;
    let ajaxcall = () => axios.jsonp(url)
        .then(function (response) {
            console.log('axios json p getThermoHygrostatInfos == '+JSON.stringify(response));
            let responseData = null;
            responseData = FormatThemoHygrostat(response);

            ajaxcall._callback(responseData);
            console.log('getOfficeTrafficInfos---'+global.areaCode.subPath)
            if(global.areaCode.subPath === 'pg=0'){
                (every) ? setTimeout(ajaxcall, 1000*every) : setTimeout(ajaxcall, 1000*60);
            }
        })
        .catch(function (error) {
            console.log('axios json p error == '+error);
            if(global.areaCode.subPath === 'pg=0'){
                (every) ? setTimeout(ajaxcall, 1000*every) : setTimeout(ajaxcall, 1000*60);
            }
        });

    ajaxcall._callback = callback;
    setTimeout(ajaxcall, 100);
}
export function getUpsBatteryStatusInfos(resource, hId, callback, every) {
    console.log('request data as global area code == '+global.areaCode.mainPath)
    let area = '';
    switch(global.areaCode.mainPath) {
        case '/site1': area = areaCode[0]; break;
        case '/site2': area = areaCode[1]; break;
        case '/site3': area = areaCode[2]; break;
    }

    let url = gUrl+siteAddress[resource]+'&officeNum='+area;
    let ajaxcall = () => axios.jsonp(url)
        .then(function (response) {
            console.log('axios json p getUpsBatteryStatusInfos == '+JSON.stringify(response));
            let responseData = null;
            responseData = FormatUPSBettery(response);

            ajaxcall._callback(responseData);
            console.log('getOfficeTrafficInfos---'+global.areaCode.subPath)
            if(global.areaCode.subPath === 'pg=0'){
                (every) ? setTimeout(ajaxcall, 1000*every) : setTimeout(ajaxcall, 1000*60);
            }
        })
        .catch(function (error) {
            console.log('axios json p error == '+error);
            if(global.areaCode.subPath === 'pg=0'){
                (every) ? setTimeout(ajaxcall, 1000*every) : setTimeout(ajaxcall, 1000*60);
            }
        });

    ajaxcall._callback = callback;
    setTimeout(ajaxcall, 100);
}
