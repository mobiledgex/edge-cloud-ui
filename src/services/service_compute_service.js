
import axios from 'axios-jsonp-pro';
import qs from 'qs';
import request from 'request';
//import * as ServiceSocket from './service_webSocket';

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
let ServerUrl = 'https://'+hostname+':3030';

if(process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://'+hostname+'/server';
}



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
    axios.get(ServerUrl+'/compute?service='+resource)
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
    axios.post(ServerUrl+'/create',{
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
    axios.post(ServerUrl+'/'+resource,{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response, body, resource)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function createNewAppInst(resource, body, callback) {
    axios.post(ServerUrl+'/CreateAppInst',qs.stringify({
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
//Multi Create
export function createNewMultiAppInst(resource, body, callback, multiData, filterData, vmCheck) {
    console.log("20191119 bodybodybodydd",multiData,":::",filterData, ": vmCheck=",vmCheck)
    axios.all(multiData.Cloudlet.map((itemCloudlet) => {
        if(vmCheck) multiData.ClusterInst = ['']
        if(multiData.AutoClusterInst) {
            multiData.ClusterInst = ['autocluster' + multiData.AppName.replace(/(\s*)/g, "")];
        }
        console.log('20191119...filterData =', filterData)
        console.log('20191119...',":itemCloudlet : ",itemCloudlet,":", filterData[itemCloudlet], ": multiData.ClusterInst=",multiData.ClusterInst)
        if(filterData[itemCloudlet] && filterData[itemCloudlet].length > 0) {
            filterData[itemCloudlet].map((items) => {
                multiData.ClusterInst.map((itemCluster) => {
                    if (items.ClusterName == itemCluster || itemCluster == '' || itemCluster.indexOf('autocluster') > -1) {
                        console.log("20191119 fanillslslsl", itemCloudlet, ":::", itemCluster)
                        return axios.post(ServerUrl + '/CreateAppInst', qs.stringify({
                            service: resource,
                            serviceBody: body,
                            serviceDomain: serviceDomain,
                            multiCloudlet: itemCloudlet,
                            multiCluster: itemCluster
                        }))
                            .then(function (response) {
                                console.log('20191119 response  registry new obj result AppInst-', response.data);
                                callback(response, body)
                            })
                            .catch(function (error) {
                                console.log("appinsterror", error);
                            });
                    }
                })
                console.log("20191119 nullcluste!!@RR!", multiData.ClusterInst)
                if (String(multiData.ClusterInst[0]).indexOf('autocluster') > -1 || multiData.ClusterInst[0] == "") {
                    multiData.ClusterInst = [];
                }
            })

            // hasn't any cluster in selected cloudlets then it should be make the new autocluster.
        } else if(!filterData[itemCloudlet]) {
            multiData.ClusterInst.map((itemCluster) => {
                if (itemCluster == '' || itemCluster.indexOf('autocluster') > -1) {
                    console.log("20191119 fanillslslsl", itemCloudlet, ":::", itemCluster)
                    return axios.post(ServerUrl + '/CreateAppInst', qs.stringify({
                        service: resource,
                        serviceBody: body,
                        serviceDomain: serviceDomain,
                        multiCloudlet: itemCloudlet,
                        multiCluster: itemCluster
                    }))
                        .then(function (response) {
                            console.log('20191119 response  registry new obj result AppInst-', response.data);
                            callback(response, body)
                        })
                        .catch(function (error) {
                            console.log("20191119 appinsterror", error);
                        });
                }
            })
            console.log("20191119 nullcluste!!@RR!", multiData.ClusterInst)
            if (String(multiData.ClusterInst[0]).indexOf('autocluster') > -1 || multiData.ClusterInst[0] == "") {
                multiData.ClusterInst = [];
            }

        } else if(vmCheck) {
            //Create VM
            multiData.Cloudlet.map((items) => {
                console.log("itemsitems",items)
                return axios.post(ServerUrl+'/CreateAppInst',qs.stringify({
                    service: resource,
                    serviceBody:body,
                    serviceDomain:serviceDomain,
                    multiCloudlet:items,
                    multiCluster:''
                }))
                    .then(function (response) {
                        console.log('response  registry new obj result VM AppInst-',response.data);
                        callback(response, body)
                    })
                    .catch(function (error) {
                        console.log("appinsterror",error);
                    });
            })
        }




    }))
}
export function deleteCompute(resource, body, callback) {
    axios.post(ServerUrl+'/deleteService',{
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
    //1개 밖에 못받아서, socket 통신으로 푸시를 받음
    //ServiceSocket.serviceStreaming('streamTemp', callback, body);
}
export function deleteUser(resource, body, callback) {
    axios.post(ServerUrl+'/deleteUser',{
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
    axios.post(ServerUrl+'/deleteAccount',{
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
    axios.post(ServerUrl+'/deleteOrg',{
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
    axios.post(ServerUrl+'/CreateClusterInst',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('20190820 response clusterInst result-',response);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}
//Multi Create
export function createNewMultiClusterInst(resource, body, callback, multiData) {

    axios.defaults.timeout = 100000000;
    axios.all(multiData.map((item) => {
        console.log("20190820 clusterCreate@111",item)
        return axios.post(ServerUrl+'/CreateClusterInst',{
            service: resource,
            serviceBody:body,
            serviceDomain:serviceDomain,
            multiData:item
        })
            .then(function (response) {
                console.log('20190820 multi response clusterInst result-',response);
                callback(response, body)
            })
            .catch(function (error) {
                console.log("error1",error);
            });
    }))

}

// 20191201 blocked : change saving the tempfile to stream
/*
export function creteTempFile(_item, _site, callback) {
    console.log("_item_item",_item)
    axios.post(ServerUrl+'/CreteTempFile',{
        item: _item,
        site: _site
    })
        .then(function (response) {
            console.log('20190820 result read status progress cluster inst...',response.data);
            //if(response.data.indexOf('successfully') > -1) clearInterval(readInterval)
            callback(response, _item)
        })
        .catch(function (error) {
            console.log("error2",error);
        });
}
*/
export function deleteTempFile(_item, _site) {

    axios.post(ServerUrl+'/DeleteTempFile',{
        item: _item,
        site: _site
    })
        .then(function (response) {
            console.log('20190820 result read status progress cluster inst...',response);

        })
        .catch(function (error) {
            console.log("error2",error);
        });
}

export function errorTempFile(_item, callback) {
    axios.post(ServerUrl+'/ErrorTempFile',{
        item: _item,
    })
        .then(function (response) {
            console.log('20190820 result read status progress ErrorTempFile',response.data);
            //if(response.data.indexOf('successfully') > -1) clearInterval(readInterval)
            callback(response)
        })
        .catch(function (error) {
            console.log("error2",error);
        });
}



export function createNewFlavor(resource, body, callback) {
    axios.post(ServerUrl+'/CreateFlavor',{
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
    axios.post(ServerUrl+'/CreateClusterFlavor',{
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
export function getStacksData(resource, body, callback) {
    axios.defaults.timeout = 10000000;
    axios.post(ServerUrl+'/GetStatStream',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('20191119 response GetStatStream result-',response,body);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function createNewCloudlet(resource, body, callback) {
    axios.defaults.timeout = 10000000;
    axios.post(ServerUrl+'/CreateCloudlet',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('20191119 response cloudlet result-',response,body);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });

    //1개 밖에 못받아서, socket 통신으로 푸시를 받음
    //ServiceSocket.serviceStreaming('streamTemp', callback, body);
}

export function updateAppInst(resource, body, callback) {
    axios.post('https://'+hostname+':3030/UpdateAppInst',{
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    })
        .then(function (response) {
            console.log('response UpdateAppInst result-',response,body);
            callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });
}


export function getMCService(resource, body, callback, self) {
    console.log('parse data get mc service ===>>>>>>>>>> ', resource)
    axios.post(ServerUrl+'/'+resource, qs.stringify({
        service: resource,
        serviceBody:body,
        serviceId: Math.round(Math.random()*10000)
    }))
        .then(function (response) {
            console.log('request get response ===== ', response)
            let parseData = null;

            //test expired
            //response.data.error = 'has expired jwt';


            if(response.data) {
                if(response.data.error) {
                    if(response.data.error.indexOf('Expired') > -1) {
                        localStorage.setItem('userInfo', null)
                        localStorage.setItem('sessionData', null)
                        callback({error:'Login Timeout Expired.<br/>Please login again'}, resource, self);
                        return;
                    } else {
                        callback({error:response.data.error}, resource, self);
                        return;
                    }
                } else {
                    parseData = JSON.parse(JSON.stringify(response));
                }
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
export function showController(resource, body, callback, self) {
    axios.post(ServerUrl+'/'+resource, qs.stringify({
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
            callback(parseData)
        })
        .catch(function (error) {
            console.log('error',error);
            callback({error:error}, resource, self);
        });


}


export function getControlService(resource, body, callback, self) {

    axios.post(ServerUrl+'/'+resource, qs.stringify({
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
