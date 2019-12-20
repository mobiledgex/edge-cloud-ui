
import axios from 'axios-jsonp-pro';
import qs from 'qs';
import request from 'request';
import * as ServiceSocket from './service_webSocket';

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
let ServerUrl = 'https://mc-stage.mobiledgex.net:9900/api/v1/auth/ctrl';

//https://mc-stage.mobiledgex.net:9900 region ShowCloudletPool region=EU



export function getListCloudletPool(resource, body, callback, self) {
    console.log('20191219 parse data get mc service ===>>>>>>>>>> ', resource)
    axios.post(ServerUrl+'/ShowCloudletPool', qs.stringify({
        service: resource,
        serviceBody:body,
        serviceId: Math.round(Math.random()*10000)
    }))
        .then(function (response) {
            console.log('20191219 request get response cloudlet pool ===== ', response)
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

                    case 'ShowCloudletPool': callback(FormatComputeCloudlet(parseData,body)); break;

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
