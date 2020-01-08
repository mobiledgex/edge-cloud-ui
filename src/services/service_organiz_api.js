
import axios from 'axios-jsonp-pro';

import FormatDmeMethod from "./formatter/formatDmeMethod";
import qs from "qs";

let hostname = window.location.hostname;

let ServerUrl = 'https://'+hostname+':3030';

if(process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://'+hostname+'/server';
}

/*
$ http POST 127.0.0.1:9900/api/v1/usercreate name=orgman passhash=pointyears email="orgman@bigorg.com"

 */
export function organize(resource, body, callback, self) {

    axios.post(ServerUrl+'/'+resource, qs.stringify({
        service: resource,
        serviceBody:body
    }))
        .then(function (response) {
            let parseData = null;
            if(response) {
                parseData = JSON.parse(JSON.stringify(response));
            } else {

            }
            console.log('parse data super user ===>>>>>>>>>> ', parseData, body)
            if(parseData) {
                if(parseData.message){

                } else {
                    callback(parseData, resource, self, body);
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

