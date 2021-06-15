import ServerWorker from '../worker/server.worker.js'
import * as endpoint from '../../helper/constant/endpoint'
import { validateExpiry } from '../config.js'
import { fetchToken } from '../service.js'

const responseListener = (self, worker, callback) => {
    worker.addEventListener('message', event => {
        if (event.data.status && event.data.status !== 200) {
            if (validateExpiry(self, event.data.message)) {
                callback(event.data)
            }
        }
        else {
            callback(event.data)
        }
    });
}

export const updateUser = (self, data, callback) => {
    let request = { method: endpoint.UPDATE_USER, data: data }
    sendAuthRequest(self, request, callback)
}

export const updatePwd = (self, data, callback) => {
    let request = { method: endpoint.NEW_PASSWORD, data: data }
    sendAuthRequest(self, request, callback)
}

export const resetPwd = (self, data, callback) => {
    let request = { method: endpoint.RESET_PASSWORD, data: data }
    sendRequest(self, request).addEventListener('message', event => {
        callback(event.data)
    });
}

export const sendRequest = (self, request, callback, token) => {
    const worker = new ServerWorker();
    worker.postMessage({ request: request, requestType: 'object', token });
    if (callback) {
        responseListener(self, worker, callback)
    }
    return worker
}

export const sendAuthRequest = (self, request, callback) => {
    let token = fetchToken(self)
    if (token) {
        return sendRequest(self, request, callback, token)
    }
}

export const sendRequests = (self, requestList, callback) => {
    const worker = new ServerWorker();
    worker.postMessage({ request: requestList, requestType: 'array', token: fetchToken(self) });
    if (callback) {
        responseListener(self, worker, callback)
    }
    return worker
}
