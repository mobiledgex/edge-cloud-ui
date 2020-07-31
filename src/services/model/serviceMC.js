import axios from 'axios';
import uuid from 'uuid';
import * as EP from './endPointTypes'


let sockets = [];

export function getEP() {
    return EP;
}

const updateServerRequestCount = (requestData, self) =>
{
    if(self)
    {
        showSpinner(self, false)
    }
    if(requestData && requestData.method && !requestData.method.toLowerCase().includes('show') && !requestData.method.toLowerCase().includes('stream'))
    {
        localStorage.setItem('ServerRequestCount', parseInt(localStorage.getItem('ServerRequestCount'))+1)
    }
}

export const mcURL = (isWebSocket) =>
{
    let serverURL = ''
    if (process.env.NODE_ENV === 'production') {
        var url = window.location.href
        var arr = url.split("/");
        serverURL = arr[0] + "//" + arr[2]
        
        if (isWebSocket) {
            serverURL = serverURL.replace('http', 'ws')
        }
    }
    else
    {
        if (isWebSocket) {
            serverURL = process.env.REACT_APP_API_ENDPOINT.replace('http', 'ws')
        }
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
    if (showMessage && self !== null && self.props.handleAlertInfo !== null) {
        self.props.handleAlertInfo('error', message)
    }
}

const checkExpiry = (self, message) => {
    let isExpired = message.indexOf('expired jwt') > -1 || message.indexOf('expired token') > -1 || message.indexOf('token is expired') > -1
    if (isExpired && self) {
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

function responseError(self, request, error, callback) {
    if (error && error.response) {
        let response  = error.response
        let message = 'UnKnown';
        let code = response.status;
        if (response.data && response.data.message) {
            message = response.data.message
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

function responseStatus(self, status)
{
    let valid = true
    switch(status)
    {
        case 504:
            valid = false
            if (self.props.handleAlertInfo) {
                self.props.handleAlertInfo('error', '504 Gateway Timeout')
            }
            break;
    }
    return valid
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
        updateServerRequestCount(request)
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
                updateServerRequestCount(requestDataList[0], self)
                responseList.map((response, i) => {
                    resResults.push(EP.formatData(requestDataList[i], response));
                })
                callback(resResults);

            }).catch(error => {
                updateServerRequestCount(requestDataList[0], self)
                if (error.response && responseStatus(self, error.response.status)) {
                    responseError(self, requestDataList[0], error, callback)
                }
            })
    }
}

export const sendSyncMultiRequest = async (self, requestDataList) => {
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
        try {
            let responseList = await axios.all(promise)
            responseList.map((response, i) => {
                resResults.push(EP.formatData(requestDataList[i], response));
            })
            showSpinner(self, false)
            return resResults
        }
        catch (error) {
            if (error.response && responseStatus(self, error.response.status)) {
                responseError(self, requestDataList[0], error)
            }
            showSpinner(self, false)
        }
    }
}

export const sendSyncRequest = async (self, request) => {
    try {
        request.showSpinner === undefined && showSpinner(self, true)
        let response = await axios.post(getHttpURL(request), request.data,
            {
                headers: getHeader(request)
            });
        updateServerRequestCount(request, self)
        return EP.formatData(request, response);
    } catch (error) {
        updateServerRequestCount(request, self)
        if (error.response && responseStatus(self, error.response.status)) {
            responseError(self, request, error)
        }
        return { request: request, error: error }
    }
}

export const sendSyncRequestWithError = async (self, request) => {
    try {
        request.showSpinner === undefined && showSpinner(self, true)
        let response = await axios.post(getHttpURL(request), request.data,
            {
                headers: getHeader(request)
            });
        updateServerRequestCount(request, self)
        return EP.formatData(request, response);
    } catch (error) {
        updateServerRequestCount(request, self)
        if (error.response && responseStatus(self, error.response.status)) {
            return { request: request, error: error }
        }
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
            updateServerRequestCount(request, self)
            callback(EP.formatData(request, response));
        })
        .catch(function (error) {
            updateServerRequestCount(request, self)
            if (error.response && responseStatus(self, error.response.status)) {
                responseError(self, request, error, callback)
            }
        })
}
