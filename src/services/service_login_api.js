
import axios from 'axios-jsonp-pro';

import FormatDmeMethod from "./formatter/formatDmeMethod";
import qs from "qs";

let hostname = window.location.hostname;
let serviceDomain = 'https://mc.mobiledgex.net:9900';
let ServerUrl = 'https://'+hostname+':3030';

if(process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://'+hostname+'/server';
}
export function setDomain(domain) {
    serviceDomain = domain;
}

export function getMethodCall(resource, body, callback, self) {

    axios.post(ServerUrl+'/masterControl', qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    }))
        .then(function (response) {
            let parseData = null;
            if(response) {
                parseData = JSON.parse(JSON.stringify(response));
            } else {

            }
            if(parseData) callback(parseData, self);
        })
        .catch(function (error) {
            console.log(error);
        });


}

export function getCurrentUserInfo(resource, body, callback, self) {

    axios.post(ServerUrl+'/'+resource, qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    }))
        .then(function (response) {
            let parseData = null;
            if(response.data) {
                //test expired 20190804
                //parseData = JSON.parse(JSON.stringify({data:{message:'expired jwt'}}));
                parseData = JSON.parse(JSON.stringify(response));

            } else {
            }
            if(parseData) callback(parseData, resource, self);
        })
        .catch(function (error) {
            console.log(error);
        });


}


/*

 */
export function createUser(resource, body, callback, self) {

    axios.post(ServerUrl+'/'+resource, qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    }))
        .then(function (response) {
            let parseData = null;
            if(response) {
                parseData = JSON.parse(JSON.stringify(response));
            } else {

            }
            if(parseData.data) {
                if(typeof parseData.data === 'string' && parseData.data.indexOf("}{") > 0) {
                    parseData.data.replace("}{", "},{")
                    parseData.data = JSON.parse(parseData.data)
                } else {

                }
                callback(parseData, body, self);
            } else {
                if(parseData.message){

                } else {
                    callback(parseData, body, self);
                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });


}
export function resetPassword(resource, body, callback, self) {

    axios.post(ServerUrl+'/'+resource, qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    }))
        .then(function (response) {
            let parseData = null;
            if(response) {
                parseData = JSON.parse(JSON.stringify(response.data));
            } else {

            }
            if(parseData) {
                if(parseData.message){
                    callback(parseData, resource, self);
                } else {
                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });


}

/*
http POST 127.0.0.1:9900/api/v1/resendverify
email=me@gmail.com
callbackurl="https://console.mobiledgex.net/verify"
 */
export function resendVerify(resource, body, callback, self) {

    axios.post(ServerUrl+'/'+resource, qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    }))
        .then(function (response) {
            let parseData = null;
            if(response) {
                parseData = JSON.parse(JSON.stringify(response.data));
            } else {

            }
            if(parseData) {
                if(parseData.message){
                    callback(parseData, resource, self);
                } else {
                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });


}

export function example(resource, body, callback) {
    axios.post(ServerUrl+'/register',qs.stringify({
        service: resource,
        serviceBody:body,
        serviceDomain:serviceDomain
    }))
        .then(function (response) {
            console.log('response  registry new obj result-',response);
            callback(response)
        })
        .catch(function (error) {
            console.log(error);
        });
}

