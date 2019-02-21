
import axios from 'axios-jsonp-pro';
import qs from 'qs';
import request from 'request';

import FormatComputeFlavor from './formatter/formatComputeFlavor';
import FormatComputeCluster from './formatter/formatComputeCluster';
import FormatComputeDev from './formatter/formatComputeDeveloper';
import FormatComputeCloudlet from './formatter/formatComputeCloudlet';
import FormatComputeApp from './formatter/formatComputeApp';
import FormatComputeOper from './formatter/formatComputeOperator';
import FormatComputeInst from './formatter/formatComputeInstance';
import FormatComputeClstInst from './formatter/formatComputeClstInstance';

const hostname = window.location.hostname;
export function getOperator(resource, callback) {
    fetch('http://'+hostname+':3030')
        .then(response => response.json())
        .then(data => {
            console.log('infux data == ', data)

        });

}

//curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
export function getDevelopersInfo(resource, callback) {
    axios.get('/dummyData/db_developer.json')
        .then(function (response) {
            callback(FormatComputeDev(response))
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function getCloudletInfo(resource, callback) {
    axios.get('/dummyData/db_cloudlet.json')
        .then(function (response) {
            callback(FormatComputeCloudlet(response))
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function getAppInfo(resource, callback) {
    axios.get('/dummyData/db_app.json')
        .then(function (response) {
            console.log('response  -',response);
            callback(FormatComputeApp(response))
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function getOperatorInfo(resource, callback) {
    axios.get('/dummyData/db_operator.json')
        .then(function (response) {
            console.log('response  -',response);
            callback(FormatComputeOper(response))
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function getComputeService(resource, callback) {
    axios.get('http://'+hostname+':3030/compute?service='+resource)
        .then(function (response) {
            let paseData = JSON.parse(JSON.stringify(response.data));
            let splitData = JSON.parse( "["+paseData.split('}\n{').join('},\n{')+"]" );
            console.log('response paseData  =-=-=-=-=-=-=-=-=-=--',resource, splitData );
            switch(resource){
                case 'flavor': callback(FormatComputeFlavor(splitData)); break;
                case 'cluster': callback(FormatComputeCluster(splitData)); break;
                case 'operator': callback(FormatComputeOper(splitData)); break;
                case 'developer': callback(FormatComputeDev(splitData)); break;
                case 'cloudlet': callback(FormatComputeCloudlet(splitData)); break;
                case 'app': callback(FormatComputeApp(splitData)); break;
                case 'appinst': callback(FormatComputeInst(splitData)); break;
                case 'clusterinst': callback(FormatComputeClstInst(splitData)); break;
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}


export function saveNewCompute(resource, body, callback) {
    axios.post('http://'+hostname+':3030/register',qs.stringify({
      service: resource,
        serviceBody:body
    }))
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function deleteCompute(resource, body, callback) {
    axios.post('http://'+hostname+':3030/delete',qs.stringify({
        service: resource,
        serviceBody:body
    }))
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response)
        })
        .catch(function (error) {
            console.log(error);
        });
}
