import axios from 'axios';
import uuid from 'uuid';
import * as EP from './endPointTypes'
import Alert from 'react-s-alert';



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

const showSpinner = (self, value) => {
    if (self.props.handleLoadingSpinner) {
        self.props.handleLoadingSpinner(value)
    }
}

const showError = (request, message) =>
{
    let showMessage = request.showMessage === undefined ? true : request.showMessage;
    if (showMessage) {
        Alert.error(message, {
            position: 'top-right',
            effect: 'slide',
            beep: true,
            timeout: 3000,
            offset: 100,
            html: true
        });
    }
}

const checkExpiry = (self, message) => {
    let isExpired  = message.indexOf('expired') > -1
    if (isExpired && self.gotoUrl) {
        localStorage.setItem('userInfo', null)
        localStorage.setItem('sessionData', null)
        setTimeout(() => self.gotoUrl('/logout'), 2000);
    }
    return !isExpired;
}

function responseError(self, request, response, callback) {
    if (response) {
        let message = 'UnKnown';
        let code = response.status;
        if (response.data && response.data.message) {
            message = response.data.message
            if (checkExpiry(self, message)) {
                showSpinner(self, false)
                showError(request, message);
                if (callback) {
                    callback({ request: request, error: { code: code, message: message } })
                }
            }
        }
    }
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
            case getEP().CREATE_APP_INST:
            case getEP().UPDATE_APP_INST:
            case getEP().DELETE_APP_INST:
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


export function sendMultiRequest(self, requestDataList, callback) {
    let isSpinner = requestDataList[0].showSpinner === undefined ? true : requestDataList[0].showSpinner;
    showSpinner(self, isSpinner)
    let promise = [];
    let resResults = [];
    requestDataList.map((request) => {
        promise.push(axios.post(EP.getPath(request), request.data,
            {
                headers: getHeader(request)
            }))

    })
    axios.all(promise)
        .then(responseList => {
            responseList.map((response, i) => {
                resResults.push(EP.formatData(requestDataList[i], response));
            })

            showSpinner(self, false)
            callback(resResults);

        }).catch(error => {
        responseError(self, requestDataList[0], error.response, callback)
    })
}

export const sendSyncRequest = async (self, request) => {
    try {
        request.showSpinner === undefined && showSpinner(self, true)
        let response = await axios.post(EP.getPath(request), request.data,
            {
                headers: getHeader(request)
            });
        request.showSpinner === undefined && showSpinner(self, false)
        return EP.formatData(request, response);
    } catch (error) {
        if (error.response) {
            responseError(self, request, error.response)
        }
    }
}

export function sendRequest(self, request, callback) {
    let isSpinner = request.showSpinner === undefined ? true : request.showSpinner;
    showSpinner(self, isSpinner)
    axios.post(EP.getPath(request), request.data,
        {
            headers: getHeader(request)
        })
        .then(function (response) {
            showSpinner(self, false)
            callback(EP.formatData(request, response));
        })
        .catch(function (error) {
            if(error.response)
            {
                responseError(self, request, error.response, callback)
            }
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




