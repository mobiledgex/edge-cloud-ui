
import axios from 'axios-jsonp-pro';
import qs from 'qs';

import FormatComputeCloudletPool from './formatter/formatComputeCloudletPool';
import FormatComputeCloudletPoolMember from './formatter/formatComputeCloudletPoolMember';


const hostname = window.location.hostname;
let serviceDomain = 'https://mc.mobiledgex.net:9900';
let ServerUrl = 'https://'+hostname+':3030';

if(process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://'+hostname+'/server';
}
//https://mc-stage.mobiledgex.net:9900 region ShowCloudletPool region=EU



export function getListCloudletPool(resource, body, callback, self) {
    console.log('20191219 parse data show cloudlet ===>>>>>>>>>> ', resource)
    axios.post(ServerUrl+'/showCloudletPool', qs.stringify({
        service: resource,
        serviceBody:body,
        serviceId: Math.round(Math.random()*10000)
    }))
        .then(function (response) {
            console.log('20191219 request get response cloudlet pool ===== ', body.region,": -- ", response)
            let parseData = null;

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

                    case 'ShowCloudletPool': callback(FormatComputeCloudletPool(parseData,body)); break;

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
export function getListCloudletPoolMember(resource, body, callback, self) {
    console.log('20191227 parse data show cloudlet pool member ===>>>>>>>>>> ', resource)
    axios.post(ServerUrl+'/showCloudletPoolMember', qs.stringify({
        service: resource,
        serviceBody:body,
        serviceId: Math.round(Math.random()*10000)
    }))
        .then(function (response) {
            console.log('20191227 request get response cloudlet pool member ===== ', response)
            let parseData = null;
            let dataArray = null;
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

            console.log('20191227 paraseData.data type -- ', typeof parseData.data)

            switch(resource){
                case 'ShowCloudletPoolMember': callback(FormatComputeCloudletPoolMember(parseData,body)); break;
                default : callback(parseData);
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
//
export function createCloudletPool(resource, body, callback, self) {
    console.log('20191219 parse data create cloudlet pool  ===>>>>>>>>>> ', resource)
    axios.post(ServerUrl+'/createCloudletPool', qs.stringify({
        service: resource,
        serviceBody:body,
        serviceId: Math.round(Math.random()*10000)
    }))
        .then(function (response) {
            console.log('20191219 request get response result create pool ===== ', response)
            let parseData = null;

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
export function createCloudletPoolMember(resource, body, callback, self) {
    console.log('20191219 parse data create cloudlet pool member ===>>>>>>>>>> ', resource)
    axios.post(ServerUrl+'/CreateCloudletPoolMember', qs.stringify({
        service: resource,
        serviceBody:body,
        serviceId: Math.round(Math.random()*10000)
    }))
        .then(function (response) {
            console.log('20191219 request get response result create pool member ===== ', response)
            let parseData = null;

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
