import axios from 'axios';
import { isLocal } from '../utils/location_utils';
import { LS_THASH } from "../helper/constant/perpetual";

export const responseValid = (mc) => {
    return Boolean(mc?.response?.status === 200)
}

export const fetchPath = (request) => {
    return `/api/v1/${request.method}`;
}

/**
 * 
 * @param {*} request 
 * @param {*} auth 
 * @returns
 */
 export const fetchToken = (self) => {
     if (isLocal()) {
         let token = localStorage.getItem(LS_THASH)
         if (token) {
             return token
         }
         if (self?.props?.history) {
             self.props.history.push('/logout');
         }
     }
 }

/**
 * 
 * @param {*} request 
 * @returns headers
 */
export const fetchHeader = (request, auth, self) => {
    let token = auth && fetchToken(self)
    if (request.token) {
        auth = true
        token = request.token
    }
    let headers = {};
    if (token && auth) {
        headers = {
            'Authorization': `Bearer ${token}`
        }
    }
    if (request.headers) {
        headers = { ...headers, ...request.headers }
    }
    return headers;
}

export const fetchResponseType = (request) => {
    return request.responseType ? request.responseType : undefined

}

export const instance = (self, request, auth) => {
    return axios.create({
        headers: fetchHeader(request, auth, self),
        responseType: fetchResponseType(request)
    })
}

export const fetchURL = (isWebSocket) => {
    let serverURL = window.location.origin
    if (isWebSocket) {
        serverURL = serverURL.replace('http', 'ws')
    }
    return serverURL
}

export const fetchHttpURL = (request) => {
    return fetchURL(false) + fetchPath(request)
}

export const validateExpiry = (self, message) => {
    if (message) {
        message = message.toLowerCase()
        let isExpired = message.indexOf('expired jwt') > -1 || message.indexOf('expired token') > -1 || message.indexOf('token is expired') > -1 || message === 'no bearer token found'
        if (isExpired && self) {
            setTimeout(() => {
                if (self && self.props && self.props.history) {
                    self.props.history.push('/logout');
                }
            }, 2000);
        }
        return !isExpired;
    }
}

/**
 * Show error alert message default is true
 * @param {*} request
 */
 const showMessage = (self, request, message) => {
    const flag = request ? request.showMessage ?? true : false
    if (flag && self?.props?.handleAlertInfo && message !== 'Forbidden' && message !== 'No bearer token found') {
        self.props.handleAlertInfo('error', message)
    }
}

const responseStatus = (self, status) => {
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

    if (!valid && self?.props?.handleAlertInfo) {
        self.props.handleAlertInfo('error', msg)
    }
    return valid
}

export const errorResponse = (self, request, error, callback, auth = true) => {
    if (error?.response) {
        const response = error.response
        const code = response.status
        const data = response.data
        let message = 'Unknown'

        if (responseStatus(self, code) && data) {
            if (request.responseType === 'arraybuffer') {
                var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                var obj = JSON.parse(decodedString);
                message = obj['message'];
            }
            else {
                message = data.message ? data.message : message
            }
        }
        if (!auth || validateExpiry(self, message)) {
            showMessage(self, request, message)
            if (callback) {
                callback({ request, error: { code, message } })
            }
        }
    }
}

/**
 * Show progress while fetching data from server, default is true
 * @param {*} request
 */
export const showProgress = (self, request) => {
    if (self?.props?.handleLoadingSpinner) {
        self.props.handleLoadingSpinner(request ? request.showSpinner ?? true : false)
    }
}
