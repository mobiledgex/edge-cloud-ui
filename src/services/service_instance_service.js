
import axios from 'axios-jsonp-pro';
import * as FormatMonitorCloudlet from "./formatter/formatMonitorCloudlet";
import * as FormatMonitorCluster from "./formatter/formatMonitorCluster";
import * as FormatMonitorApp from "./formatter/formatMonitorApp";

//NodeJS removed, none of the below methods will work, if below methods are required direct communication needs to be implemented

let hostname = window.location.hostname;
let ServerUrl = 'https://'+hostname+':3030';

if(process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://'+hostname+'/server';
}

/**
 * @deprecated Since version 1.0. Will be deleted in version 2.0. Use serviceMC instead.
 */
export function getAppinstHealth(resource, callback) {
    let resResults = [];
    axios.all(
        resource.map((reso) => {
            return axios.post(ServerUrl+'/timeAppinst', {
                service: 'timeAppinst',
                serviceBody:reso,
                serviceId: Math.round(Math.random()*10000)
            })
                .then(function (response) {
                    resResults = resResults.concat(FormatMonitorApp.formatData(response))

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

/**
 * @deprecated Since version 1.0. Will be deleted in version 2.0. Use serviceMC instead.
 */
export function getClusterHealth(resource, callback) {
    let resResults = [];
        //
    axios.all(
        resource.map((reso) => {
            return axios.post(ServerUrl+'/timeClusterinst', {
                service: 'timeClusterinst',
                serviceBody:reso,
                serviceId: Math.round(Math.random()*10000)
            })
                .then(function (response) {
                    resResults = resResults.concat(FormatMonitorCluster.formatData(response))

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

/**
 * @deprecated Since version 1.0. Will be deleted in version 2.0. Use serviceMC instead.
 */
export function getCloudletHealth(resource, callback) {
    let resResults = [];
        //
    axios.all(
        resource.map((reso) => {
            return axios.post(ServerUrl+'/timeCloudlet', {
                service: 'timeCloudlet',
                serviceBody:reso,
                serviceId: Math.round(Math.random()*10000)
            })
                .then(function (response) {
                    resResults = resResults.concat(FormatMonitorCloudlet.formatData(response))
                    console.log('20190930 formated cloudlet result === ', resResults)
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

/**
 * @deprecated Since version 1.0. Will be deleted in version 2.0. Use serviceMC instead.
 */
export function getAppClusterInfo(cluster, app, callback, self) {
    axios.get(ServerUrl+'/appInstanceList?cluster='+cluster+'&app='+app)
        .then(function (response) {
            let parseData = JSON.parse(JSON.stringify(response.data));
            //callback(FormatApplicationInfo(parseData.results), self);
            callback(parseData.results, self);
        })
        .catch(function (error) {
            console.log(error);
        });
}

/**
 * @deprecated Since version 1.0. Will be deleted in version 2.0. Use serviceMC instead.
 */
export function getAppClusterApp(clusters, callback) {
    let getCount = 0;
    let results = [];
    if(clusters.length) {
        clusters.map((cluster) => {
            axios.get(ServerUrl+'/appInstance?cluster='+cluster)
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

/**
 * @deprecated Since version 1.0. Will be deleted in version 2.0. Use serviceMC instead.
 */
export function getTcpUdpClusterInfo(cluster, app, callback, self) {
    let getCount = 0;

    axios.get(ServerUrl+'/tcpudpCluster?cluster='+cluster+'&app='+app)
        .then(function (response) {
            let parseData = JSON.parse(JSON.stringify(response.data));

            callback(parseData, self);

        })
        .catch(function (error) {
            console.log(error);
        });



}
