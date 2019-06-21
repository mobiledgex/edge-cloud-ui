
import axios from 'axios-jsonp-pro';

import FormatDmeMethod from "./formatter/formatDmeMethod";
import qs from "qs";

let hostname = window.location.hostname;
let serviceDomain = 'https://mc.mobiledgex.net:9900';

export function setDomain(domain) {
    serviceDomain = domain;
}

export function getMethodCall(resource, body, callback, self) {

    axios.post('https://'+hostname+':3030/masterControl', qs.stringify({
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
            console.log('parse data token===>>>>>>>>>> ', parseData)
            if(parseData) callback(parseData, self);
        })
        .catch(function (error) {
            console.log(error);
        });


}

export function getCurrentUserInfo(resource, body, callback, self) {

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
            console.log('parse data super user ===>>>>>>>>>> ', parseData)
            if(parseData) callback(parseData, resource, self);
        })
        .catch(function (error) {
            console.log(error);
        });


}

/*
$ http POST 127.0.0.1:9900/api/v1/usercreate name=orgman passhash=pointyears email="orgman@bigorg.com"

 */
export function createUser(resource, body, callback, self) {

    axios.post('https://'+hostname+':3030/'+resource, qs.stringify({
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
            console.log('parse data super user ===>>>>>>>>>> ', parseData)
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

    axios.post('https://'+hostname+':3030/'+resource, qs.stringify({
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
            console.log('parse data reset password ===>>>>>>>>>> ', parseData)
            if(parseData) {
                if(parseData.message){
                    console.log(parseData.message)
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

    axios.post('https://'+hostname+':3030/'+resource, qs.stringify({
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
            console.log('parse data result send mail ===>>>>>>>>>> ', parseData)
            if(parseData) {
                if(parseData.message){
                    console.log(parseData.message)
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
    axios.post('https://'+hostname+':3030/register',qs.stringify({
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

