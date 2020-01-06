
import axios from 'axios-jsonp-pro';
import qs from 'qs';

const hostname = window.location.hostname;
let serviceDomain = 'https://mc.mobiledgex.net:9900';
let ServerUrl = 'https://'+hostname+':3030';

if(process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://'+hostname+'/server';
}






//Multi Create
export function createNewMultiAppInst(resource, body, callback, multiData, filterData, vmCheck) {
    console.log("20191119 bodybodybodydd",multiData,":::",filterData, ": vmCheck=",vmCheck)


    axios.all(multiData.Cloudlet.map((itemCloudlet) => {
        if(vmCheck) multiData.ClusterInst = ['']
        if(multiData.AutoClusterInst) {
            multiData.ClusterInst = ['autocluster' + multiData.AppName.replace(/(\s*)/g, "")];
        }
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
                                console.log('20191119 response  registry new obj result AppInst-', response, ":", body);
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
                            console.log('20191119 response  registry new obj result autocluster AppInst-', response.data);
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
            //callback(response, body)
        })
        .catch(function (error) {
            console.log(error);
        });

    //1개 밖에 못받아서, socket 통신으로 푸시를 받음
    ServiceSocket.serviceStreaming('streamTemp', callback, body);
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
                    } else if (response.data.error == 'No user') {

                        parseData = JSON.parse(JSON.stringify(response));

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
