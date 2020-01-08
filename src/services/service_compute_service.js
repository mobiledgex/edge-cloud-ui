
import axios from 'axios-jsonp-pro';
import qs from 'qs';
import request from 'request';

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





