import axios from 'axios';
import { fetchHeader, fetchPath, fetchURL, fetchHttpURL, validateExpiry, fetchResponseType } from '../config';
import { formatData } from '../format/format';

let sockets = [];

const showSpinner = (self, value) => {
    if (self && self.props.handleLoadingSpinner) {
        self.props.handleLoadingSpinner(value)
    }
}

const showError = (self, request, message) => {
    let showMessage = request.showMessage === undefined ? true : request.showMessage;
    if (showMessage && self !== null && self.props.handleAlertInfo && message !== 'Forbidden') {
        self.props.handleAlertInfo('error', message)
    }
}

const responseError = (self, request, error, callback) => {
    if (error && error.response) {
        let response = error.response
        let message = 'UnKnown';
        let code = response.status;
        if (response.data && response.data) {
            if (request.responseType === 'arraybuffer') {
                var decodedString = String.fromCharCode.apply(null, new Uint8Array(response.data));
                var obj = JSON.parse(decodedString);
                message = obj['message'];
            }
            else {
                message = response.data.message ? response.data.message : message
            }
            if (validateExpiry(self, message)) {
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
    const ws = new WebSocket(`${fetchURL(true)}/ws${fetchPath(request)}`)
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
                    callback({ request: request, wsObj: ws, close: true })
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
            promise.push(axios.post(fetchHttpURL(request), request.data,
                {
                    headers: fetchHeader(request)
                }))

        })
        axios.all(promise)
            .then(responseList => {
                requestDataList[0].showSpinner === undefined && showSpinner(self, false)
                responseList.map((response, i) => {
                    resResults.push(formatData(requestDataList[i], response));
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
            promise.push(axios.post(fetchHttpURL(request), request.data,
                {
                    headers: fetchHeader(request)
                }))
        })
        try {
            let responseList = await axios.all(promise)
            requestDataList[0].showSpinner === undefined && showSpinner(self, false)
            responseList.map((response, i) => {
                resResults.push(formatData(requestDataList[i], response));
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
        let response = await axios.post(fetchHttpURL(request), request.data,
            {
                headers: fetchHeader(request),
                responseType: fetchResponseType(request)
            });
        request.showSpinner === undefined && showSpinner(self, false)
        return formatData(request, response);
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
        let response = await axios.post(fetchHttpURL(request), request.data,
            {
                headers: fetchHeader(request)
            });
        request.showSpinner === undefined && showSpinner(self, false)
        return formatData(request, response);
    } catch (error) {
        request.showSpinner === undefined && showSpinner(self, false)
        if (error.response && responseStatus(self, error.response.status)) {
            return { request: request, error: error }
        }
    }
}


export function sendRequest(self, request, callback) {
    request.showSpinner === undefined && showSpinner(self, true)
    axios.post(fetchHttpURL(request), request.data,
        {
            headers: fetchHeader(request)
        })
        .then(function (response) {
            request.showSpinner === undefined && showSpinner(self, false)
            callback(formatData(request, response));
        })
        .catch(function (error) {
            request.showSpinner === undefined && showSpinner(self, false)
            if (error.response && responseStatus(self, error.response.status)) {
                responseError(self, request, error, callback)
            }
        })
}
