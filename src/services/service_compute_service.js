
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
import formatComputeAccounts from './formatter/formatComputeAccounts';

const hostname = window.location.hostname;
let serviceDomain = 'https://mc.mobiledgex.net:9900';

export function setDomain(domain) {
    console.log('reset service domain ---- ', domain)
    serviceDomain = domain;
}
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
    axios.post('https://'+hostname+':3030/create',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function createNewApp(resource, body, callback) {
    axios.post('https://'+hostname+':3030/CreateApp',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function createNewAppInst(resource, body, callback) {
    axios.post('https://'+hostname+':3030/CreateAppInst',qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    }))
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function deleteCompute(resource, body, callback) {
    axios.post('https://'+hostname+':3030/deleteService',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function deleteUser(resource, body, callback) {
    axios.post('https://'+hostname+':3030/deleteUser',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function deleteAccount(resource, body, callback) {
    axios.post('https://'+hostname+':3030/deleteAccount',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function deleteOrg(resource, body, callback) {
    axios.post('https://'+hostname+':3030/deleteOrg',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response,body)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function createNewClusterInst(resource, body, callback) {
    axios.post('https://'+hostname+':3030/CreateClusterInst',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response clusterInst result-',response);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function createNewFlavor(resource, body, callback) {
    axios.post('https://'+hostname+':3030/CreateFlavor',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response flavor result-',response);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function createNewClusterFlavor(resource, body, callback) {
    axios.post('https://'+hostname+':3030/CreateClusterFlavor',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response clusterFlavor result-',response);
            callback(response)
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function createNewCloudlet(resource, body, callback) {
    axios.post('https://'+hostname+':3030/CreateCloudlet',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response cloudlet result-',response,body);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}


export function getMCService(resource, body, callback, self) {
    console.log('parse data get mc service ===>>>>>>>>>> ', resource, serviceDomain)
    axios.post('https://'+hostname+':3030/'+resource, qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    }))
        .then(function (response) {

            let parseData = null;
            if(response.data) {
                parseData = JSON.parse(JSON.stringify(response));
            } else {
                parseData = response;
            }
            if(parseData){
                switch(resource){
                    case 'showOrg': callback(FormatComputeOrganization(parseData)); break;
                    case 'ShowFlavor': callback(FormatComputeFlavor(parseData,body)); break;
                    case 'ShowClusterFlavor': callback(FormatComputeCluster(parseData,body)); break;
                    case 'ShowUsers': callback(formatComputeUsers(parseData)); break;
                    case 'ShowAccounts': callback(formatComputeAccounts(parseData)); break;
                    case 'ShowCloudlet': callback(FormatComputeCloudlet(parseData,body)); break;
                    case 'ShowClusterInst': callback(FormatComputeClstInst(parseData,body)); break;
                    case 'ShowClusterInsts': callback(FormatComputeClstInst(parseData,body)); break;
                    case 'ShowApps': callback(FormatComputeApp(parseData,body)); break;
                    case 'ShowApp': callback(FormatComputeApp(parseData,body)); break;
                    case 'ShowAppInst': callback(FormatComputeInst(parseData,body)); break;
                    case 'ShowAppInsts': callback(FormatComputeInst(parseData,body)); break;
                    case 'showController': callback(parseData); break;
                    case 'ShowRole': callback(parseData); break;
                    case 'UpdateVerify': callback(parseData); break;
                    case 'ResetPassword': callback(parseData); break;
                    case 'passwordreset': callback(parseData); break;
                    default : callback(parseData);
                }
            }
        })
        .catch(function (error) {
            try {
                if(String(error).indexOf('Network Error') > -1){
                    console.log("NETWORK ERROR@@@@@");
                } else {
                    callback({error:error}, resource, self);
                }
            } catch(e) {
                console.log('any error ??? ')
            }
        });


}
export function showAppInst(resource, body, callback, self) {
    axios.post('https://'+hostname+':3030/'+resource, qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    }))
        .then(function (response) {
            console.log("showInstName!!",response)
            let parseData = null;
            if(response.data) {
                parseData = JSON.parse(JSON.stringify(response));
            } else {
                parseData = response;
            }
            console.log('parse data userinfo ===>>>>>>>>>> ', parseData)
            callback(FormatComputeInst(parseData))
        })
        .catch(function (error) {
            console.log('error',error);
            callback({error:error}, resource, self);
        });


}


export function getControlService(resource, body, callback, self) {

    axios.post('https://'+hostname+':3030/'+resource, qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
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

                    case 'ShowClusterInst': callback(FormatComputeClstInst(parseData)); break;

                }
            }
        })
        .catch(function (error) {
            console.log('error',error);
            callback({error:error}, resource, self);
        });


}
