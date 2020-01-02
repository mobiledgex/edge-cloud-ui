
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