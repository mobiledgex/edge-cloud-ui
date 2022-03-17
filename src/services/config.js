import axios from 'axios';

export const responseValid = (mc) => {
    return Boolean(mc?.response?.status === 200)
}

export const fetchPath = (request) => {
    return `/api/v1/${request.method}`;
}

export const fetchHeader = (request) => {
    let headers = {};
    if (request.token) {
        headers = {
            'Authorization': `Bearer ${request.token}`
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
        headers: fetchHeader(self, request, auth),
        responseType: fetchResponseType(request)
    })
}

export const fetchURL = (isWebSocket) => {
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
    const flag = Boolean(request?.showMessage)
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
        self.props.handleLoadingSpinner(Boolean(request?.showSpinner))
    }
}
