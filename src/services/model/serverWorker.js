import ServerWorker from '../worker/server.worker.js'
import { checkExpiry } from './serviceMC'
import * as endpoint from '../../helper/constant/endpoint'

const getToken = (self) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    if (store) {
        return store.userToken
    }
    if (self && self.props && self.props.history) {
        self.props.history.push('/logout');
    }
}

const responseListener = (self, worker, callback) => {
    worker.addEventListener('message', event => {
        if (event.data.status && event.data.status !== 200) {
            if (checkExpiry(self, event.data.message)) {
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
    let token = getToken(self)
    if (token) {
        return sendRequest(self, request, callback, token)
    }
}

export const sendRequests = (self, requestList, callback) => {
    const worker = new ServerWorker();
    worker.postMessage({ request: requestList, requestType: 'array', token: getToken(self) });
    if (callback) {
        responseListener(self, worker, callback)
    }
    return worker
}
