//import axios from 'axios';
//import fetchJsonp from 'fetch-jsonp';
import axios from 'axios-jsonp-pro';
import FormatHipassMonitor from './formatter/formatHipassMonitor';
import FormatHipassMonitorTraffic from './formatter/formatHipassMonitorTraffic';
import FormatHipassMonitorLane from './formatter/formatHipassMonitorLane';
import FormatCardStatus from "./formatter/formatCardStatus";
import FormatCardManager from "./formatter/formatCardManager";

//let gUrl = 'http://121.78.87.232:8080/station/';
//let gUrl = 'http://211.195.163.17:8080/station/';
let gUrl = 'http://192.168.10.42:8080/station/';
/*
<감면현황>
Map<KEY, Map> getCardStatInfos()

갱신주기: 12시간

감면현황_면제     : REDUCTION_EXEMPTION
감면현황_지역주민 : REDUCTION_RESIDENT

<교통카드별 B/L 현황>
Map<KEY, Map> getCardBLStatInfoList()

갱신주기: 12시간

Key 정의
카드이름      : CARD_NAME
마스터최대건수: THRESHOLD_COUNT
현재마스터건수: CURR_COUNT

<BL현황>
전자: CARD_NAME "전자카드"
교통: CARD_NAME "전체"


*/
let areaCode = ['097', '098', '099', 'ALL'];

/*

*/

let siteAddress = {

    cardReductionStatInfos:'hipassDashboard.do?method=getCardReductionStatInfos',//카드관리현황
    cardBLStatInfoList:'hipassDashboard.do?method=getCardBLStatInfoList',//교통카드별 B/L현황

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
export function getCardReductionStatInfos(resource, hId, callback, every) {

    axios.jsonp(getUrl(resource))
            .then(function (response) {
                console.log('axios json getCardManagement == ' + JSON.stringify(response));
                let responseData = FormatCardStatus(response)
                callback(responseData);

            })
            .catch(function (error) {
                console.log('axios json p error == ' + error);
            });


}
export function getCardBLStatInfoList(resource, hId, callback, every) {
    console.log('request data as global area code == '+global.areaCode)
    axios.jsonp(getUrl(resource))
            .then(function (response) {
                console.log('axios json p == '+JSON.stringify(response));
                let responseData = FormatCardManager(response);
                callback(responseData);

            })
            .catch(function (error) {
                console.log('axios json p error == '+error);

            });

}
