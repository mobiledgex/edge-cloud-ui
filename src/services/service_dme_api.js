
import axios from 'axios-jsonp-pro';

import FormatDmeMethod from "./formatter/formatDmeMethod";

let hostname = window.location.hostname;

export function getMethodCall(resource, callback, self) {
    axios.get('https://'+hostname+':3030/total?cloudlet='+resource.cloudlet+'&fromTime='+resource.fromTime+'&limit='+resource.limit)
        .then(function (response) {
            let parseData = JSON.parse(JSON.stringify(response.data));
            callback(FormatDmeMethod(parseData.results), self);
        })
        .catch(function (error) {
            console.log(error);
        });


}

