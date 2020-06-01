import axios from 'axios';
import uuid from 'uuid';
import * as EP from './endPointTypes'


let sockets = [];

export function getEP() {
    return EP;
}

export const mcURL = (isWebSocket) =>
{
    let serverURL = ''
    if(process.env.NODE_ENV === 'production' )
    {
        var url = window.location.href
        var arr = url.split("/");
        serverURL = arr[0] + "//" + arr[2]
    }

    if (serverURL.includes('localhost')) {
        serverURL = process.env.REACT_APP_API_ENDPOINT;
    }

    if(isWebSocket)
    {
        serverURL = process.env.REACT_APP_API_ENDPOINT.replace('http', 'ws')
    }
    return serverURL
}

const getHttpURL = (request)=>
{
    return mcURL(false) + EP.getPath(request)
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
    if (self && self.props.handleLoadingSpinner) {
        self.props.handleLoadingSpinner(value)
    }
}

const showError = (self, request, message) => {
    let showMessage = request.showMessage === undefined ? true : request.showMessage;
    if (showMessage && self && self.handleAlertInfo) {
        self.handleAlertInfo('error', message)
    }
}

const checkExpiry = (self, message) => {
    let isExpired = message.indexOf('expired jwt') > -1 || message.indexOf('expired token') > -1 || message.indexOf('token is expired') > -1
    if (isExpired && self) {
        localStorage.setItem('userInfo', null)
        localStorage.setItem('sessionData', null)
        setTimeout(() => {
            if (self && self.props && self.props.history) {
                self.props.history.push({
                    pathname: '/logout'
                })
            }
        }, 2000);
    }
    return !isExpired;
}

function responseError(self, request, response, callback) {
    if (response && response.error) {
        let error  = response.error
        let message = 'UnKnown';
        let code = error.status;
        if (error.data && error.data.message) {
            message = error.data.message
            if (checkExpiry(self, message)) {
                showSpinner(self, false)
                showError(self, request, message);
                if (callback) {
                    callback({ request: request, error: { code: code, message: message } })
                }
            }
        }
    }
}

export function sendWSRequest(request, callback) {
    const ws = new WebSocket(`${mcURL(true)}/ws${EP.getPath(request)}`)
    ws.onopen = () => {
        sockets.push({uuid: request.uuid, socket: ws, isClosed: false});
        ws.send(`{"token": "${request.token}"}`);
        ws.send(JSON.stringify(request.data));
    }
    ws.onmessage = evt => {
        let data = JSON.parse(evt.data);
        let response = {};
        response.data = data;
        callback({request: request, response: response, wsObj:ws});
    }

    ws.onclose = evt => {
        sockets.map((item, i) => {
            if (item.uuid === request.uuid) {
                if (item.isClosed === false && evt.code === 1000) {
                    callback({request: request, wsObj:ws})
                }
                sockets.splice(i, 1)
            }
        })
    }
}

export function sendMultiRequest(self, requestDataList, callback) {
    
    if (requestDataList && requestDataList.length > 0) {
        let isSpinner = requestDataList[0].showSpinner === undefined ? true : requestDataList[0].showSpinner;
        showSpinner(self, isSpinner)
        let promise = [];
        let resResults = [];
        requestDataList.map((request) => {
            promise.push(axios.post(getHttpURL(request), request.data,
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
                responseError(self, requestDataList[0], error, callback)
            })
    }
}

export const sendSyncRequest = async (self, request) => {
    try {
        showSpinner(self, true)
        let response = await axios.post(getHttpURL(request), request.data,
            {
                headers: getHeader(request)
            });

        showSpinner(self, false)
        return EP.formatData(request, response);
    } catch (error) {
        responseError(self, request, error)
    }
}

export const sendSyncRequestWithError = async (self, request) => {
    try {
        request.showSpinner === undefined && showSpinner(self, true)
        let response = await axios.post(getHttpURL(request), request.data,
            {
                headers: getHeader(request)
            });
        request.showSpinner === undefined && showSpinner(self, false)
        return EP.formatData(request, response);
    } catch (error) {
        return { request: request, error: error }
    }
}


export function sendRequest(self, request, callback) {
    let isSpinner = request.showSpinner === undefined ? true : request.showSpinner;
    showSpinner(self, isSpinner)
    axios.post(getHttpURL(request), request.data,
        {
            headers: getHeader(request)
        })
        .then(function (response) {
            showSpinner(self, false)
            callback(EP.formatData(request, response));
        })
        .catch(function (error) {
            if (error.response) {
                responseError(self, request, error, callback)
            }
        })
}