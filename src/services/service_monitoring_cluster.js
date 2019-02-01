
import axios from 'axios-jsonp-pro';

import FormatMonitorCluster from './formatter/formatMonitorCluster';


export function getClusterHealth(resource, callback) {
    let reqCnt = resource.length;
    let respCount = 0;
    let resResults = [];
    resource.map((rsName) => {
        axios.get('http://localhost:3030/timeCluster?cluster='+rsName)
            .then(function (response) {
                console.log('response service monitoring cluster === ', response)
                resResults = resResults.concat(FormatMonitorCluster(response))
                if(respCount === reqCnt-1) callback(resResults)
                respCount ++;
            })
            .catch(function (error) {
                console.log(error);
            });
    })


}

