import axios from 'axios';
import * as EP from '../../../../services/model/endPointTypes'

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

export const getToken = (self) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    if (store) {
        return store.userToken
    }
    if (self && self.props && self.props.history) {
        self.props.history.push('/logout');
    }
}

export const checkExpiry = (self, message) => {
    if (message) {
        let isExpired = message.indexOf('expired jwt') > -1 || message.indexOf('expired token') > -1 || message.indexOf('token is expired') > -1
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

const responseError = (self, request, error, callback) => {
    if (error && error.response) {
        let response = error.response
        let message = 'UnKnown';
        let code = response.status;
        if (response.data && response.data.message) {
            message = response.data.message
            if (checkExpiry(self, message)) {
                if (callback) {
                    callback({ request: request, error: { code: code, message: message } })
                }
            }
        }
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

    if (!valid && self.props.handleAlertInfo) {
        self.props.handleAlertInfo('error', msg)
    }
    return valid
}

const authInstance = (self) => {
    let token = getToken(self)
    if (token) {
        return axios.create({
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
}

/**
 * 
 * @param {*} self: current class object
 * @param {*} request: method, data 
 * @param {*} format: if not using worker then format the data
 * @returns response for given method
 */
export const sendRequest = async (self, request, format) => {
    try {
        let response = await authInstance(self).post(getHttpURL(request), request.data);
        response = { status: response.status, data: response.data }
        return format ? EP.formatData(request, response) : { request, response }
    } catch (error) {
        if (error.response && responseStatus(self, error.response.status)) {
            responseError(self, request, error)
        }
        return { request: request, error: error }
    }
}

/**
 * 
 * @param {*} self: current class object
 * @param {*} requestDataList: list of method & data 
 * @param {*} format: if not using worker then format the data
 * @returns list of response for given methods
 */
export const sendMultiRequest = async (self, requestDataList, format) => {
    let token = getToken(self)
    if (token) {
        if (requestDataList && requestDataList.length > 0) {
            let promise = [];
            requestDataList.forEach(request => {
                request.token = token
                promise.push(authInstance().post(getHttpURL(request), request.data))
            })

            try {
                let mcList = []
                let responseList = await axios.all(promise)
                responseList.forEach((response, i) => {
                    let request = requestDataList[i]
                    response = { status: response.status, data: response.data }
                    mcList.push(format ? EP.formatData(request, response) : { request, response })
                })
                return mcList
            }
            catch (error) {
                if (error.response && responseStatus(self, error.response.status)) {
                    responseError(self, requestDataList[0], error)
                }
            }
        }
    }
}