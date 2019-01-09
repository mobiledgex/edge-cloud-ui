//import axios from 'axios';
//import fetchJsonp from 'fetch-jsonp';
import axios from 'axios-jsonp-pro';
import FormatCCTVUrl from './formatter/formatCCTVUrl';


//let gUrl = 'http://121.78.87.232:8080/station/';
//let gUrl = 'http://211.195.163.17:8080/station/';
let gUrl = 'http://192.168.10.42:8080/station/';
/*
신공항    : 097 <Integer>
북인천    : 098 <Integer>
청라      : 099 <Integer>
전체      : ALL <Integer>

CCTV1:"캐노피 서울방향"
CCTV2:"캐노피 공항방향"
CCTV3:"다차로 상행-좌"
CCTV4:"다차로 상행-우"
CCTV5:"다차로 하행-좌"
CCTV6:"다차로 하행-우"
CCTV7:"축중 하이패스(상3)"
CCTV8:"축중 하이패스(하2)"
*/
let areaCode = ['097', '098', '099', 'ALL'];

/*
http://192.168.232.132:8080/station/hipassDashboard.do?method=getCctvURLTitle&officeNum=099&callback=Hipass
*/

let siteAddress = {
    cctvURLTitle:'hipassDashboard.do?method=getCctvURLTitle',
    cctvViewTitle:'hipassDashboard.do?method=getCctvViewTitle'
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
export function getCctvURLTitle(resource, hId, callback, every) {
    let ajaxcall = function(){

        let aaa = axios.jsonp(getUrl(resource))
            .then(function (response) {
                let responseData = null;
                responseData = FormatCCTVUrl(response);
                ajaxcall._callback(responseData);
            })
            .catch(function (error) {
                console.log('axios json p error == '+error);
            });
    }
    ajaxcall._callback = callback;
    setTimeout(ajaxcall, 100);
}
export function getCctvViewTitle(resource, hId, callback, every) {
    let ajaxcall = function() {
        let bbb = axios.jsonp(getUrl(resource))
            .then(function (response) {
                ajaxcall._callback(response);
            })
            .catch(function (error) {
                console.log('axios json p error == '+error);
            });
    }
    ajaxcall._callback = callback;
    setTimeout(ajaxcall, 100);
}
