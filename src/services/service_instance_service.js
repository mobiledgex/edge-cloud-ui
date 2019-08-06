
import axios from 'axios-jsonp-pro';
import qs from 'qs';
import request from 'request';

import FormatComputeDev from './formatter/formatComputeDeveloper';
import FormatComputeCloudlet from './formatter/formatComputeCloudlet';
import FormatComputeApp from './formatter/formatComputeApp';
import FormatComputeOper from './formatter/formatComputeOperator';
import FormatComputeInst from './formatter/formatComputeInstance';
import FormatMonitorCluster from "./formatter/formatMonitorCluster";
import FormatMonitorApp from "./formatter/formatMonitorApp";
import FormatApplicationInfo from "./formatter/formatApplicationInfo";

let hostname = window.location.hostname;
export function getOperator(resource, callback) {

    fetch('https://'+hostname+':3030')
        .then(response => response.json())
        .then(data => {
            console.log('infux data == ', data)

        });

}

//curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt

export function getClusterService(resource, callback) {
    axios.get('https://'+hostname+':3030/compute?service='+resource)
        .then(function (response) {
            let paseData = JSON.parse(JSON.stringify(response.data));
            let splitData = JSON.parse( "["+paseData.split('}\n{').join('},\n{')+"]" );
            console.log('response paseData  -',splitData );
            switch(resource){
                case 'flavors': callback(FormatComputeInst(splitData)); break;
                case 'cluster': callback(FormatComputeInst(splitData)); break;
                case 'operator': callback(FormatComputeOper(splitData)); break;
                case 'developer': callback(FormatComputeDev(splitData)); break;
                case 'cloudlet': callback(FormatComputeCloudlet(splitData)); break;
                case 'app': callback(FormatComputeApp(splitData)); break;
                case 'appinst': callback(FormatComputeInst(splitData)); break;
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}
export function getAppinstHealth(resource, callback) {
    let resResults = [];
    //
    axios.all(
        resource.map((reso) => {
            return axios.post('https://'+hostname+':3030/timeAppinst', qs.stringify({
                service: 'timeAppinst',
                serviceBody:reso,
                serviceId: Math.round(Math.random()*10000)
            }))
                .then(function (response) {
                    resResults = resResults.concat(FormatMonitorApp(response))

                })
                .catch(function (error) {
                    try {
                        if(String(error).indexOf('Network Error') > -1){
                            console.log("NETWORK ERROR@@@@@");
                        } else {
                            callback({error:error}, resource);
                        }
                    } catch(e) {
                        console.log('any error ??? ')
                    }
                });
        })
    )
        .then(axios.spread((resOne, resTwo, resThree) => {
            callback(resResults)
        }))


}
export function getClusterHealth(resource, callback) {
    let resResults = [];
        //
    axios.all(
        resource.map((reso) => {
            return axios.post('https://'+hostname+':3030/timeClusterinst', qs.stringify({
                service: 'timeClusterinst',
                serviceBody:reso,
                serviceId: Math.round(Math.random()*10000)
            }))
                .then(function (response) {
                    resResults = resResults.concat(FormatMonitorCluster(response))

                })
                .catch(function (error) {
                    try {
                        if(String(error).indexOf('Network Error') > -1){
                            console.log("NETWORK ERROR@@@@@");
                        } else {
                            //callback({error:error}, resource);
                        }
                    } catch(e) {
                        console.log('any error ??? ')
                    }
                });
        })
    )
        .then(axios.spread((resOne, resTwo, resThree, resFour, resFive) => {
            callback(resResults)
        }))


}

export function getAppClusterInfo(cluster, app, callback, self) {
    axios.get('https://'+hostname+':3030/appInstanceList?cluster='+cluster+'&app='+app)
        .then(function (response) {
            let parseData = JSON.parse(JSON.stringify(response.data));
            //callback(FormatApplicationInfo(parseData.results), self);
            callback(parseData.results, self);
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function getAppClusterApp(clusters, callback) {
    let getCount = 0;
    let results = [];
    if(clusters.length) {
        clusters.map((cluster) => {
            axios.get('https://'+hostname+':3030/appInstance?cluster='+cluster)
                .then(function (response) {
                    let parseData = JSON.parse(JSON.stringify(response.data));
                    results.push(parseData.results);
                    if(getCount === clusters.length-1) {
                        getCount = 0;
                        callback(results);
                    } else {
                        getCount ++;
                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
}



export function getTcpUdpClusterInfo(cluster, app, callback, self) {
    let getCount = 0;

    axios.get('https://'+hostname+':3030/tcpudpCluster?cluster='+cluster+'&app='+app)
        .then(function (response) {
            let parseData = JSON.parse(JSON.stringify(response.data));

            callback(parseData, self);

        })
        .catch(function (error) {
            console.log(error);
        });



}
