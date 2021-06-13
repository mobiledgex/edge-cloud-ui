import { fetchHttpURL, validateExpiry } from "./config"
import axios from 'axios';
import { formatData } from "./format";
/**
 * Show progress while fetching data from server, default is true
 * @param {*} request
 */
const showProgress = (self, request) => {
    const flag = request ? (typeof request.showSpinner === 'boolean') ? request.showSpinner : true : false
    if (self && self.props && self.props.handleLoadingSpinner) {
        self.props.handleLoadingSpinner(flag)
    }
}

/**
 * Show error alert message default is true
 * @param {*} request
 */
const showMessage = (self, request, message) => {
    const flag = request ? (typeof request.showMessage === 'boolean') ? request.showMessage : true : false
    if (self && self.props && self.props.handleAlertInfo && message !== 'Forbidden') {
        self.props.handleLoadingSpinner(flag)
    }
}

/**
 * 
 * @param {*} request 
 * @param {*} auth 
 * @returns 
 */
export const fetchToken = (self) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    if (store) {
        return store.userToken
    }
    if (self && self.props && self.props.history) {
        self.props.history.push('/logout');
    }
}

/**
 * 
 * @param {*} request 
 * @returns headers
 */
export const fetchHeader = (self, request, auth) => {
    const token = fetchToken()
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

const instance = (self, request, auth) => {
    let token = fetchToken(self)
    if (token) {
        return axios.create({
            headers: fetchHeader(self, request, auth),
            responseType: fetchResponseType(request)
        })
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

const errorResponse = (self, request, error, callback) => {
    if (error && error.response) {
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
        }
        else {
            message = data.message ? data.message : message
        }
        if (validateExpiry(self, message)) {
            showMessage(self, request, message)
            if (callback) {
                callback({ request, error: { code, message } })
            }
        }
    }
}

const sendSyncRequest = async (self, request, auth) => {
    let response = {}
    try {
        showProgress(self, request)
        response = await instance(self, request, auth).post(fetchHttpURL(request), request.data);
    }
    catch (error) {
        errorResponse(self, request, error)
        response = { request, error }
    }
    showProgress(self)
    return response
}

export const authSyncRequest = async (self, request) => {
    return await sendSyncRequest(self, request, true)
}

export const multiAuthRequest = (self, requestList, callback) => {
    if (requestList && requestList.length > 0) {
        let promise = [];
        requestList.forEach((request) => {
            promise.push(instance(self, request, true).post(fetchHttpURL(request), request.data))
        })        
        let responseList = [];
        showProgress(self, requestList[0])
        axios.all(promise)
            .then(list => {
                list.map((response, i) => {
                    responseList.push(formatData(requestList[i], response));
                })
                callback(responseList);

            }).catch(error => {
                errorResponse(self, requestList[0], error, callback)
            })
        showProgress(self)
    }
}