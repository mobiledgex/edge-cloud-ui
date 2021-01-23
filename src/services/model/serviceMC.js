import axios from 'axios';
import * as EP from './endPointTypes'


let sockets = [];

export function getEP() {
    return EP;
}

export const mcURL = (isWebSocket) => {
    let serverURL = ''
    if (process.env.NODE_ENV === 'production') {
        var url = window.location.href
        var arr = url.split("/");
        serverURL = arr[0] + "//" + arr[2]

        if (isWebSocket) {
            serverURL = serverURL.replace('http', 'ws')
        }
    }
    else {
        if (isWebSocket) {
            serverURL = process.env.REACT_APP_API_ENDPOINT.replace('http', 'ws')
        }
    }
    return serverURL
}

const getHttpURL = (request) => {
    return mcURL(false) + EP.getPath(request)
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
    if (showMessage && self !== null && self.props.handleAlertInfo) {
        self.props.handleAlertInfo('error', message)
    }
}

export const checkExpiry = (self, message) => {
    if (message) {
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
}

function responseError(self, request, error, callback) {
    if (error && error.response) {
        let response = error.response
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

function responseStatus(self, status) {
    let valid = true
    let msg = ''
    switch (status) {
        case 504:
            msg = '504 Gateway Timeout'
            valid = false
            break;
        case 502:
            msg = '502 Bad Gateway'
            valid = false
            break;
    }

    if (!valid && self.props.handleAlertInfo) {
        self.props.handleAlertInfo('error', msg)
    }
    return valid
}

export function sendWSRequest(request, callback) {
    const ws = new WebSocket(`${mcURL(true)}/ws${EP.getPath(request)}`)
    ws.onopen = () => {
        sockets.push({ uuid: request.uuid, socket: ws, isClosed: false });
        ws.send(`{"token": "${request.token}"}`);
        ws.send(JSON.stringify(request.data));
    }
    ws.onmessage = evt => {
        let data = JSON.parse(evt.data);
        let response = {};
        response.data = data;
        callback({ request: request, response: response, wsObj: ws });
    }

    ws.onclose = evt => {
        sockets.map((item, i) => {
            if (item.uuid === request.uuid) {
                if (item.isClosed === false && evt.code === 1000) {
                    callback({ request: request, wsObj: ws, close:true })
                }
                sockets.splice(i, 1)
            }
        })
    }
}

export function sendMultiRequest(self, requestDataList, callback) {
    if (requestDataList && requestDataList.length > 0) {
        requestDataList[0].showSpinner === undefined && showSpinner(self, true)
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
                requestDataList[0].showSpinner === undefined && showSpinner(self, false)
                responseList.map((response, i) => {
                    resResults.push(EP.formatData(requestDataList[i], response));
                })
                callback(resResults);

            }).catch(error => {
                requestDataList[0].showSpinner === undefined && showSpinner(self, false)
                if (error.response && responseStatus(self, error.response.status)) {
                    responseError(self, requestDataList[0], error, callback)
                }
            })
    }
}

export const sendSyncMultiRequest = async (self, requestDataList) => {
    if (requestDataList && requestDataList.length > 0) {
        requestDataList[0].showSpinner === undefined && showSpinner(self, true)
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
            requestDataList[0].showSpinner === undefined && showSpinner(self, false)
            responseList.map((response, i) => {
                resResults.push(EP.formatData(requestDataList[i], response));
            })
            return resResults
        }
        catch (error) {
            requestDataList[0].showSpinner === undefined && showSpinner(self, false)
            if (error.response && responseStatus(self, error.response.status)) {
                responseError(self, requestDataList[0], error)
            }
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
        request.showSpinner === undefined && showSpinner(self, false)
        return EP.formatData(request, response);
    } catch (error) {
        request.showSpinner === undefined && showSpinner(self, false)
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
        request.showSpinner === undefined && showSpinner(self, false)
        return EP.formatData(request, response);
    } catch (error) {
        request.showSpinner === undefined && showSpinner(self, false)
        if (error.response && responseStatus(self, error.response.status)) {
            return { request: request, error: error }
        }
    }
}


export function sendRequest(self, request, callback) {
    request.showSpinner === undefined && showSpinner(self, true)
    axios.post(getHttpURL(request), request.data,
        {
            headers: getHeader(request)
        })
        .then(function (response) {
            request.showSpinner === undefined && showSpinner(self, false)
            callback(EP.formatData(request, response));
        })
        .catch(function (error) {
            request.showSpinner === undefined && showSpinner(self, false)
            if (error.response && responseStatus(self, error.response.status)) {
                responseError(self, request, error, callback)
            }
        })
}
