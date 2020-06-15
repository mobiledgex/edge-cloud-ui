import axios from 'axios';
import uuid from 'uuid';
import * as EP from './endPointTypes'


let sockets = [];


export function getEP() {
    return EP;
}

export const mcURL = (isWebSocket) =>
{
    let serverURL = process.env.REACT_APP_API_ENDPOINT
    if (process.env.NODE_ENV === 'production') {
        var url = window.location.href
        var arr = url.split("/");
        serverURL = arr[0] + "//" + arr[2]
    }

    if (isWebSocket) {
        serverURL = serverURL.replace('http', 'ws')
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
    if (self.props.handleLoadingSpinner) {
        self.props.handleLoadingSpinner(value)
    }
}

const showError = (self, request, message) => {
    let showMessage = request.showMessage === undefined ? true : request.showMessage;
    if (showMessage && self && self.props.handleAlertInfo) {
        self.props.handleAlertInfo('error', message)
    }
}

const checkExpiry = (self, message) => {
    let isExpired = message.indexOf('expired jwt') > -1 || message.indexOf('expired token') > -1 || message.indexOf('token is expired') > -1
    if (isExpired && self.gotoUrl) {
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
                showError(self, request, message);
                if (callback) {
                    callback({request: request, error: {code: code, message: message}})
                }
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
        if (error.response) {
            responseError(self, request, error.response)
        }
    }
}