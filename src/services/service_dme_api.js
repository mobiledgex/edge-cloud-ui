
import axios from 'axios-jsonp-pro';

import FormatDmeMethod from "./formatter/formatDmeMethod";

let hostname = window.location.hostname;
let serviceDomain = 'https://mc.mobiledgex.net:9900';
let ServerUrl = 'https://'+hostname+':3030';

if(process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://'+hostname+'/server';
}
export function getMethodCall(resource, callback, self) {
    axios.get(ServerUrl+'/total?cloudlet='+resource.cloudlet+'&fromTime='+resource.fromTime+'&limit='+resource.limit)
        .then(function (response) {
            let parseData = JSON.parse(JSON.stringify(response.data));
            callback(FormatDmeMethod(parseData.results), self);
        })
        .catch(function (error) {
            console.log(error);
        });


}

