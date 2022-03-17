import { fetchHttpURL, validateExpiry } from "./config"
import axios from 'axios';
import { formatData } from "./format";
import { isBoolean } from "../utils/boolean_utils";
import { LS_THASH } from "../helper/constant/perpetual";
import { isLocal } from "../utils/location_utils";

const formatter = (request, response, format = true, self) => {
    format = isBoolean(request.format) ? request.format : format
    if (format) {
        return formatData(request, response, self)
    }
    else {
        return { request, response: { status: response.status, data: response.data } }
    }
}
/**
 * Show progress while fetching data from server, default is true
 * @param {*} request
 */
const showProgress = (self, request) => {
    const flag = request ? isBoolean(request.showSpinner) ? request.showSpinner : true : false
    if (self && self.props && self.props.handleLoadingSpinner) {
        self.props.handleLoadingSpinner(flag)
    }
}

/**
 * Show error alert message default is true
 * @param {*} request
 */
const showMessage = (self, request, message) => {
    const flag = request ? isBoolean(request.showMessage) ? request.showMessage : true : false
    if (flag && self && self.props && self.props.handleAlertInfo && message !== 'Forbidden' && message !== 'No bearer token found') {
        self.props.handleAlertInfo('error', message)
    }
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
        if (self && self.props && self.props.history) {
            self.props.history.push('/logout');
        }
    }
}

/**
 * 
 * @param {*} request 
 * @returns headers
 */
export const fetchHeader = (self, request, auth) => {
    const token = auth && fetchToken(self)
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
    return axios.create({
        headers: fetchHeader(self, request, auth),
        responseType: fetchResponseType(request)
    })
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

    if (!valid && self && self.props && self.props.handleAlertInfo) {
        self.props.handleAlertInfo('error', msg)
    }
    return valid
}

const errorResponse = (self, request, error, callback, auth = true) => {
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
 * Validate if token exist or token flag is true
 * @param {*} self - current component object
 * @returns boolean
 */
const userLoggedIn = (self, auth = true) => {
    if (localStorage.getItem(LS_THASH) || !auth) {
        return true
    }
    else {
        if (self && self.props && self.props.history) {
            self.props.history.push('/logout');
        }
    }
}

/**
 * @param {*} self: current class object
 * @param {*} request: method, data, format 
 * @param {*} auth: token is required if auth true 
 */
const sendSyncRequest = async (self, request, auth = true) => {
    let mc = {}
    if (userLoggedIn(self, auth)) {
        try {
            showProgress(self, request)
            const response = await instance(self, request, auth).post(fetchHttpURL(request), request.data)
            mc = formatter(request, response)
        }
        catch (error) {
            errorResponse(self, request, error, undefined, auth)
            mc = { request, error }
        }
        showProgress(self)
    }
    return mc
}

export const authSyncRequest = async (self, request) => {
    return await sendSyncRequest(self, request)
}

export const syncRequest = async (self, request) => {
    return await sendSyncRequest(self, request, false)
}

/**
 * Asynchronous request
 * @param {*} self: current class object
 * @param {*} requestList: list of method & data 
 * @param {*} callback: callback function
 * @param {*} format: if not using worker then format the data
 * @returns list of request, response object
 */
export const multiAuthRequest = (self, requestList, callback, format = true, single = false) => {
    if (userLoggedIn(self) && requestList && requestList.length > 0) {
        let promise = [];
        requestList.forEach((request) => {
            promise.push(instance(self, request, true).post(fetchHttpURL(request), request.data))
        })
        let responseList = [];
        showProgress(self, requestList[0])
        axios.all(promise)
            .then(list => {
                list.forEach((response, i) => {
                    responseList.push(formatter(requestList[i], response, format, self));
                })
                showProgress(self)
                single ? callback(responseList && responseList.length > 0 && responseList[0]) : callback(responseList);

            }).catch(error => {
                showProgress(self)
                errorResponse(self, requestList[0], error, callback)
            })
    }
}

export const authRequest = (self, request, callback, format) => {
    multiAuthRequest(self, [request], callback, format, true)
}

/**
 * Synchronous request
 * @param {*} self: current class object
 * @param {*} requestList: list of method & data 
 * @param {*} callback: callback function
 * @param {*} format: if not using worker then format the data
 * @returns list of request, response object
 */
export const multiAuthSyncRequest = async (self, requestList, format = true) => {
    let resResults = [];
    if (requestList && requestList.length > 0) {
        if (userLoggedIn(self)) {
            showProgress(self, requestList[0])
            let promise = [];
            requestList.forEach((request) => {
                promise.push(instance(self, request, true).post(fetchHttpURL(request), request.data))
            })

            try {
                let responseList = await axios.all(promise)
                responseList.forEach((response, i) => {
                    resResults.push(formatter(requestList[i], response, format));
                })
            }
            catch (error) {
                errorResponse(self, requestList[0], error)
            }
            showProgress(self)
        }
        return resResults
    }
}

export const showAuthSyncRequest = async (self, request) => {
    let dataList = []
    let mc = await authSyncRequest(self, request)
    if (mc) {
        const response = mc.response
        if (response && response.status === 200 && response.data) {
            dataList = response.data;
        }
    }
    return dataList;
}