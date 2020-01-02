import axios from 'axios';
import uuid from 'uuid';
import * as EP from './endPointTypes'



let sockets = [];

export function getEP()
{
    return EP;
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

export function sendWSRequest(request, callback) {
    let url = process.env.REACT_APP_API_ENDPOINT;
    url = url.replace('http','ws');
    const ws = new WebSocket(`${url}/ws${EP.getPath(request)}`)
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
            case getEP().DELETE_CLOUDLET:
            //case getEP().CREATE_APP_INST:
            case getEP().UPDATE_APP_INST:
            //case getEP().DELETE_APP_INST:
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

    axios.post(EP.getPath(request), request.data,
        {
            headers: getHeader(request)
        })
        .then(function (response) {
            if (responseValid(request, response, callback, self)) {
                callback(EP.formatData(request, response));
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




