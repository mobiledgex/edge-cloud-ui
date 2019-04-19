
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
import FormatComputeOrganization from './formatter/formatComputeOrganization';
import formatComputeUsers from './formatter/formatComputeUsers';

const hostname = window.location.hostname;
export function getOperator(resource, callback) {
    fetch('https://'+hostname+':3030')
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
    const orgDummy = [
        {
            result:{
                type:'Developer',
                username:'kunhee',
                role:'viewer',
                email:'khcho@naver.com',
                organization:'BIC',
                phone:'010-0000-0000'
            }
        },
        {
            result:{
                type:'Developer',
                username:'user1',
                role:'contributor',
                email:'user1@naver.com',
                organization:'BIC',
                phone:'010-1111-1111'
            }
        },
        {
            result:{
                type:'Developer',
                username:'user2',
                role:'viewer',
                email:'user2@naver.com',
                organization:'BIC',
                phone:'010-2222-2222'
            }
        },
    ]
    axios.get('https://'+hostname+':3030/compute?service='+resource)
        .then(function (response) {
            let paseData = JSON.parse(JSON.stringify(response.data));
            let splitData = JSON.parse( "["+paseData.split('}\n{').join('},\n{')+"]" );
            console.log('response paseData  =-=-=-=-=-=-=-=-=-=--',resource, splitData );
            console.log(splitData);
            console.log(orgDummy);
            switch(resource){
                case 'flavor': callback(FormatComputeFlavor(splitData)); break;
                case 'cluster': callback(FormatComputeCluster(splitData)); break;
                case 'operator': callback(FormatComputeOper(splitData)); break;
                case 'developer': callback(FormatComputeDev(splitData)); break;
                case 'cloudlet': callback(FormatComputeCloudlet(splitData)); break;
                case 'app': callback(FormatComputeApp(splitData)); break;
                case 'appinst': callback(FormatComputeInst(splitData)); break;
                case 'clusterinst': callback(FormatComputeClstInst(splitData)); break;
                case 'organization': callback(FormatComputeOrganization(orgDummy)); break;
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}


export function saveNewCompute(resource, body, callback) {
    axios.post('https://'+hostname+':3030/create',qs.stringify({
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
    axios.post('https://'+hostname+':3030/delete',qs.stringify({
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


export function getMCService(resource, body, callback, self) {

    axios.post('https://'+hostname+':3030/'+resource, qs.stringify({
        service: resource,
        serviceBody:body
    }))
        .then(function (response) {
            let parseData = null;
            if(response.data) {
                parseData = JSON.parse(JSON.stringify(response));
            } else {

            }
            console.log('parse data userinfo ===>>>>>>>>>> ', parseData)
            if(parseData){
                switch(resource){
                    case 'showOrg': callback(FormatComputeOrganization(parseData)); break;
                    case 'ShowFlavor': callback(FormatComputeFlavor(parseData)); break;
                    case 'ShowClusterFlavor': callback(FormatComputeCluster(parseData)); break;
                    case 'ShowUsers': callback(formatComputeUsers(parseData)); break;
                    case 'ShowCloudlet': callback(FormatComputeCloudlet(parseData)); break;
                    case 'ShowClusterInst': callback(FormatComputeClstInst(parseData)); break;
                    case 'ShowApps': callback(FormatComputeApp(parseData)); break;
                    case 'ShowAppInst': callback(FormatComputeInst(parseData)); break;
                    case 'showController': callback(parseData); break;
                }
            }
        })
        .catch(function (error) {
            console.log('error',error);
            callback({error:error}, resource, self);
        });


}
