//import axios from 'axios';
//import fetchJsonp from 'fetch-jsonp';
import axios from 'axios-jsonp-pro';
import Influx from 'influxdb-nodejs';


import FormatOfficeTraffic from './formatter/formatOfficeTraffic'
import FormatCollectwayTraffic from './formatter/formatCollectwayTraffic'
import FormatInoutwayTraffic from './formatter/formatInoutwayTraffic'

//참고: https://vicanso.github.io/influxdb-nodejs/
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

let gUrl = 'http://dashboard.mobiledgex.net:9090/api/v1/query?query=';


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

const client = new Influx('https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet');

export function getOperator(resource, hId, callback, every) {
    console.log('request data of operator == '+client)


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
