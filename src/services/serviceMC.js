import axios from 'axios';
import uuid from 'uuid';
import * as EndPoint from './endPointTypes'
import FormatComputeOrganization from './formatter/formatComputeOrganization';
import FormatComputeUsers from './formatter/formatComputeUsers';
import FormatComputeAccounts from './formatter/formatComputeAccounts';
import FormatComputeCloudlet from './formatter/formatComputeCloudlet';
import FormatComputeClstInst from './formatter/formatComputeClstInstance';
import FormatComputeFlavor from './formatter/formatComputeFlavor';
import FormatComputeApp from './formatter/formatComputeApp';
import FormatComputeInst from './formatter/formatComputeInstance';



let sockets = [];

export function getEP()
{
    return EndPoint;
}
export function generateUniqueId() {
    return uuid();
}

function getHeader(request) {
    let headers = {};
    if (request.token) {
        headers = {
            'Authorization': `Bearer ${request.token}`
        }
    }

    return headers;
}

function responseError(request, error, callback, self) {
    try {
        if (String(error).indexOf('Network Error') > -1) {
            console.log("NETWORK ERROR");
        } else {
            callback({ error: error }, request.method, self);
        }
    } catch (e) {
        console.log('any error ??? ')
    }
}

function responseValid(request, response, callback, self) {
    let parseData = null;
    if (response.data) {
        if (response.data.error) {
            if (response.data.error.indexOf('Expired') > -1) {
                localStorage.setItem('userInfo', null)
                localStorage.setItem('sessionData', null)
                callback({ error: 'Login Timeout Expired.<br/>Please login again' }, request.method, self);
                return;
            } else {
                callback({ error: response.data.error }, request.method, self);
                return;
            }
        } else {
            parseData = JSON.parse(JSON.stringify(response));
        }
    } else {
        parseData = response;
    }
    return parseData;
}

function formatData(request, response) {
    switch (request.method) {
        case getEP().SHOW_ORG:
            return { data: FormatComputeOrganization(response, request.data) }
        case getEP().SHOW_USERS:
            return { data: FormatComputeUsers(response, request.data) }
        case getEP().SHOW_ACCOUNTS:
            return { data: FormatComputeAccounts(response, request.data) }
        case getEP().SHOW_CLOUDLET:
            return { data: FormatComputeCloudlet(response, request.data) }
        case getEP().SHOW_CLUSTER_INST:
            return { data: FormatComputeClstInst(response, request.data) }
        case getEP().SHOW_FLAVOR:
            return { data: FormatComputeFlavor(response, request.data) }
        case getEP().SHOW_APP:
            return { data: FormatComputeApp(response, request.data) }
        case getEP().SHOW_APP_INST:
            return { data: FormatComputeInst(response, request.data) }
        case getEP().SHOW_SELF:
            return { response: response, method: request.method };
        default:
            return { request: request, response: response };
    }
}

function getPath(request) {
    switch (request.method) {
        case getEP().SHOW_ORG:
            return '/api/v1/auth/org/show';
        case getEP().SHOW_USERS:
            return '/api/v1/auth/role/showuser';
        case getEP().SHOW_ACCOUNTS:
            return '/api/v1/auth/user/show';
        case getEP().SHOW_ROLE:
            return '/api/v1/auth/role/assignment/show';
        case getEP().SHOW_CONTROLLER:
            return '/api/v1/auth/controller/show';
        case getEP().SETTING_LOCK:
            return '/api/v1/auth/restricted/user/update';
        case getEP().CURRENT_USER:
            return '/api/v1/auth/user/current';
        case getEP().SHOW_SELF:
            return '/api/v1/auth/audit/showself';
        case getEP().SHOW_CLOUDLET:
        case getEP().CREATE_CLOUDLET:
        case getEP().SHOW_CLUSTER_INST:
        case getEP().CREATE_CLUSTER_INST:
        case getEP().DELETE_CLUSTER_INST:
        case getEP().STREAM_CLUSTER_INST:
        case getEP().SHOW_FLAVOR:
        case getEP().CREATE_FLAVOR:
        case getEP().DELETE_FLAVOR:
        case getEP().SHOW_APP:
        case getEP().SHOW_APP_INST:
            return `/api/v1/auth/ctrl/${request.method}`;
        case getEP().LOGIN:
            return `/api/v1/${request.method}`
        case getEP().VERIFY_EMAIL:
            return `/api/v1/${request.method}`;
        default:
            return null;
    }
}

export function sendWSRequest(request, callback) {
    const ws = new WebSocket(`ws://${process.env.REACT_APP_API_ENDPOINT}/ws${getPath(request)}`)
    ws.onopen = () => {
        sockets.push({ uuid: request.uuid, socket: ws, isClosed:false });
        ws.send(`{"token": "${request.token}"}`);
        ws.send(JSON.stringify(request.data));
    }
    ws.onmessage = evt => {
        let data = JSON.parse(evt.data);
        let response = {};
        response.data = data;
        switch (request.method) {
            case getEP().CREATE_CLUSTER_INST:
            case getEP().DELETE_CLUSTER_INST:
            case getEP().CREATE_CLOUDLET:
                clearSockets(request.uuid);
        }
        callback({ request: request, response: response });
    }

    ws.onclose = evt => {
        sockets.map((item, i) => {
            if(item.uuid === request.uuid)
            {
                if(item.isClosed === false && evt.code===1000)
                {
                    callback({ request: request })
                }
                sockets.splice(i,1)
            }   
        }) 
    }
}

export function sendRequest(request, callback, self) {

    axios.post(getPath(request), request.data,
        {
            headers: getHeader(request)
        })
        .then(function (response) {
            if (responseValid(request, response, callback, self)) {
                callback(formatData(request, response));
            }
        })
        .catch(function (error) {
            responseError(request, error, callback)
        })
}

export function clearSockets(uuid) {
        sockets.map(item => {
            let socket = item.socket;
            if (uuid === item.uuid && socket.readyState === WebSocket.OPEN) {
                socket.close();
                item.isClosed = true;
            }
        })
    
}




