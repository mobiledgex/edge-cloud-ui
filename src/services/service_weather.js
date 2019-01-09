//import axios from 'axios';
//import fetchJsonp from 'fetch-jsonp';
import axios from 'axios-jsonp-pro';
import FormatBridgeWeather from './formatter/formatBridgeWeather';

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
    bridgeWeatherInfos:'hipassDashboard.do?method=getBridgeWeatherInfos'

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
export function getBridgeWeatherInfos(resource, hId, callback, every) {
    console.log('request data as global area code == '+global.areaCode.mainPath)

    axios.jsonp(getUrl(resource))
            .then(function (response) {
                console.log('axios json p weather == '+JSON.stringify(response));
                let responseData = FormatBridgeWeather(response);
                callback(responseData);

            })
            .catch(function (error) {
                console.log('axios json p error == '+error);

            });

}
