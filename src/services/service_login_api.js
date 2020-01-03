
import axios from 'axios-jsonp-pro';
import qs from "qs";

let hostname = window.location.hostname;
let serviceDomain = 'https://mc.mobiledgex.net:9900';
let ServerUrl = 'https://'+hostname+':3030';

if(process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://'+hostname+'/server';
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
