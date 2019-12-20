import axios from 'axios-jsonp-pro';
import qs from 'qs';
import request from 'request';
import dotenv from 'dotenv';

import FormatComputeDev from './formatter/formatComputeDeveloper';
import FormatComputeCloudlet from './formatter/formatComputeCloudlet';
import FormatComputeApp from './formatter/formatComputeApp';
import FormatComputeOper from './formatter/formatComputeOperator';
import FormatComputeInst from './formatter/formatComputeInstance';
import FormatMonitorCloudlet from "./formatter/formatMonitorCloudlet";
import FormatMonitorCluster from "./formatter/formatMonitorCluster";
import FormatMonitorApp from "./formatter/formatMonitorApp";
import FormatApplicationInfo from "./formatter/formatApplicationInfo";


let hostname = window.location.hostname;
/*
if environment variable USE_SERVER_SUFFIX
then
   set variable ServerUrl to "https://<hostname>/server"
else
    set variable ServerUrl to "https://<hostname>:3030"
    ---> axios.post(ServerUrl + '/CreateFlavor')
 */
let ServerUrl = 'https://' + hostname + ':3030';

if (process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://' + hostname + '/server';
}

export function getOperator(resource, callback) {

    fetch(ServerUrl)
        .then(response => response.json())
        .then(data => {
            console.log('infux data == ', data)

        });

}

//curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt

export function getClusterService(resource, callback) {
    axios.get(ServerUrl + '/compute?service=' + resource)
        .then(function (response) {
            let paseData = JSON.parse(JSON.stringify(response.data));
            let splitData = JSON.parse("[" + paseData.split('}\n{').join('},\n{') + "]");
            console.log('response paseData  -', splitData);
            switch (resource) {
                case 'flavors':
                    callback(FormatComputeInst(splitData));
                    break;
                case 'cluster':
                    callback(FormatComputeInst(splitData));
                    break;
                case 'operator':
                    callback(FormatComputeOper(splitData));
                    break;
                case 'developer':
                    callback(FormatComputeDev(splitData));
                    break;
                case 'cloudlet':
                    callback(FormatComputeCloudlet(splitData));
                    break;
                case 'app':
                    callback(FormatComputeApp(splitData));
                    break;
                case 'appinst':
                    callback(FormatComputeInst(splitData));
                    break;
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

export function getAppinstHealth(resource, callback) {

    console.log('getAppinstHealth====>', resource)

    let resResults = [];
    //
    axios.all(
        resource.map((reso) => {


            console.log('getAppinstHealth====>' + reso);

            return axios.post(ServerUrl + '/timeAppinst', {
                service: 'timeAppinst',
                serviceBody: reso,
                serviceId: Math.round(Math.random() * 10000)
            })
                .then(function (response) {
                    resResults = resResults.concat(FormatMonitorApp(response))

                })
                .catch(function (error) {
                    try {
                        if (String(error).indexOf('Network Error') > -1) {
                            console.log("NETWORK ERROR@@@@@");
                        } else {
                            callback({error: error}, resource);
                        }
                    } catch (e) {
                        console.log('any error ??? ')
                    }
                });
        })
    )
        .then(axios.spread((resOne, resTwo, resThree) => {
            callback(resResults)
        }))


}

/*
$ http --verify=false --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/metrics/cluster <<< '{"region":"EU","clusterinst":{"cluster_key":{"name":"asdfqqq"},"cloudlet_key":{"operator_key":{"name":"TDG"},"name":"frankfurt-eu"},"developer":"MobiledgeX"},"selector":"cpu","last":2}'
 */
export function getClusterHealth(resource, callback) {
    let resResults = [];
    //
    axios.all(
        resource.map((reso) => {
            return axios.post(ServerUrl + '/timeClusterinst', {
                service: 'timeClusterinst',
                serviceBody: reso,
                serviceId: Math.round(Math.random() * 10000)
            })
                .then(function (response) {
                    resResults = resResults.concat(FormatMonitorCluster(response))

                })
                .catch(function (error) {
                    try {
                        if (String(error).indexOf('Network Error') > -1) {
                            console.log("NETWORK ERROR@@@@@");
                        } else {
                            //callback({error:error}, resource);
                        }
                    } catch (e) {
                        console.log('any error ??? ')
                    }
                });
        })
    )
        .then(axios.spread((resOne, resTwo, resThree, resFour, resFive) => {
            callback(resResults)
        }))


}

export function getCloudletHealth(resource, callback) {
    let resResults = [];
    //
    axios.all(
        resource.map((reso) => {
            return axios.post(ServerUrl + '/timeCloudlet', {
                service: 'timeCloudlet',
                serviceBody: reso,
                serviceId: Math.round(Math.random() * 10000)
            })
                .then(function (response) {
                    resResults = resResults.concat(FormatMonitorCloudlet(response))
                    console.log('20190930 formated cloudlet result === ', resResults)
                })
                .catch(function (error) {
                    try {
                        if (String(error).indexOf('Network Error') > -1) {
                            console.log("NETWORK ERROR@@@@@");
                        } else {
                            //callback({error:error}, resource);
                        }
                    } catch (e) {
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
    axios.get(ServerUrl + '/appInstanceList?cluster=' + cluster + '&app=' + app)
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
    if (clusters.length) {
        clusters.map((cluster) => {
            axios.get(ServerUrl + '/appInstance?cluster=' + cluster)
                .then(function (response) {
                    let parseData = JSON.parse(JSON.stringify(response.data));
                    results.push(parseData.results);
                    if (getCount === clusters.length - 1) {
                        getCount = 0;
                        callback(results);
                    } else {
                        getCount++;
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

    axios.get(ServerUrl + '/tcpudpCluster?cluster=' + cluster + '&app=' + app)
        .then(function (response) {
            let parseData = JSON.parse(JSON.stringify(response.data));

            callback(parseData, self);

        })
        .catch(function (error) {
            console.log(error);
        });


}
