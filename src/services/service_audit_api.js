import axios from 'axios-jsonp-pro';

import FormatDmeMethod from "./formatter/formatDmeMethod";
import qs from "qs";

let hostname = window.location.hostname;

let ServerUrl = 'https://' + hostname + ':3030';

if (process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    ServerUrl = 'https://' + hostname + '/server';
}


export function showAuditOrg(resource, body, callback, self) {

    axios.post(ServerUrl + '/showauditrog', qs.stringify({
        service: resource,
        serviceBody: body
    }))
        .then(function (response) {
            let parseData = null;
            if (response) {
                parseData = JSON.parse(JSON.stringify(response));
            } else {

            }
            console.log('20191018 parse data audit org ===>>>>>>>>>> ', parseData, body)
            if (parseData) {
                if (parseData.error) {
                    callback({parseData}, resource, self, body);
                } else {
                    callback(parseData, resource, self, body);
                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}

export const showAuditOrg2 = async (resource, body) => {

    return await axios.post(ServerUrl + '/showauditrog', qs.stringify({
        service: resource,
        serviceBody: body
    })).then((response) => {
        return JSON.parse(JSON.stringify(response));
    })


}


export function showAuditSelf(resource, body, callback, self) {

    axios.post(ServerUrl + '/' + resource, qs.stringify({
        service: resource,
        serviceBody: body
    }))
        .then(function (response) {
            let parseData = null;
            if (response) {
                if (JSON.stringify(response)) parseData = JSON.parse(JSON.stringify(response));
            } else {

            }

            if (parseData) {
                if (parseData.error) {
                    callback(parseData, resource, self, body);
                } else {
                    callback(parseData, resource, self, body);
                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });


}

export function sendEmailAudit(resource, body, callback, self) {

    axios.post(ServerUrl + '/' + resource, qs.stringify({
        service: resource,
        serviceBody: body
    }))
        .then(function (response) {
            let parseData = null;
            if (response) {
                if (JSON.stringify(response)) parseData = JSON.parse(JSON.stringify(response));
            } else {

            }

            if (parseData) {
                if (parseData.message) {

                } else {
                    callback(parseData, resource, self, body);
                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });


}

