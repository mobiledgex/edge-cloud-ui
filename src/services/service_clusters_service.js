
import axios from 'axios-jsonp-pro';

import request from 'request';

import FormatComputeDev from './formatter/formatComputeDeveloper';
import FormatComputeCloudlet from './formatter/formatComputeCloudlet';
import FormatComputeApp from './formatter/formatComputeApp';
import FormatComputeOper from './formatter/formatComputeOperator';
import FormatComputeInst from './formatter/formatComputeInstance';
import FormatMonitorCluster from "./formatter/formatMonitorCluster";

let hostname = window.location.hostname;
export function getOperator(resource, callback) {

    fetch('http://'+hostname+':3030')
        .then(response => response.json())
        .then(data => {
            console.log('infux data == ', data)

        });

}

//curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt

export function getClusterService(resource, callback) {
    axios.get('http://'+hostname+':3030/compute?service='+resource)
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
export function getClusterHealth(resource, callback) {
    let reqCnt = resource.length;
    let respCount = 0;
    let resResults = [];
    resource.map((rsName) => {
        axios.get('http://'+hostname+':3030/timeCluster?cluster='+rsName)
            .then(function (response) {
                resResults = resResults.concat(FormatMonitorCluster(response))
                if(respCount === reqCnt-1) {
                    callback(resResults)
                    respCount = 0;
                } else {
                    respCount ++;
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    })


}
export function getAppClusterInfo(cluster, app, callback) {
    axios.get('http://'+hostname+':3030/appInstanceList?cluster='+cluster+'&app='+app)
        .then(function (response) {
            let parseData = JSON.parse(JSON.stringify(response.data));
            callback(parseData.results);
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function getTcpUdpSeriesInfo(cluster, columns, callback) {
    // axios.get('http://'+hostname+':3030/tcpudp?cluster='+cluster+'&column='+column)
    //     .then(function (response) {
    //         let parseData = JSON.parse(JSON.stringify(response.data));
    //         callback(parseData.results);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

    let getCount = 0;
    let results = [];
    if(columns.length) {
        columns.map((column) => {
            console.log('getTcpUdp column ~~~    ~~~', column)

        })
        axios.get('http://'+hostname+':3030/tcpudpCluster?cluster='+cluster+'&limit='+50)
            .then(function (response) {
                console.log('getTcpUdp Info ~~~~~~~~~~~~~~~~~~~~~000000..,.', response)
                let parseData = JSON.parse(JSON.stringify(response.data));
                results.push(parseData.results);
                console.log('adadaddd', getCount, columns.length)
                callback(results);

            })
            .catch(function (error) {
                console.log(error);
            });

    }
}


export function getTcpUdpClusterInfo(clusters, callback) {
    let getCount = 0;
    let results = [];
    if(clusters.length) {
        clusters.map((cluster) => {
            axios.get('http://'+hostname+':3030/tcpudpCluster?cluster='+cluster)
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
