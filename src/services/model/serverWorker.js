import AlertWorker from '../worker/mex.worker.js'
import { WORKER_SERVER } from '../worker/constant.js'
import { checkExpiry } from './serviceMC'
import { NEW_PASSWORD, RESET_PASSWORD, UPDATE_USER } from './endpoints.js'

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
    let request = { method: UPDATE_USER, data: data }
    sendAuthRequest(self, request, callback)
}

export const updatePwd = (self, data, callback) => {
    let request = { method: NEW_PASSWORD, data: data }
    sendAuthRequest(self, request, callback)
}

export const resetPwd = (self, data, callback) => {
    let request = { method: RESET_PASSWORD, data: data }
    sendRequest(self, request).addEventListener('message', event => {
        callback(event.data)
    });
}
 
export const sendRequest = (self, request, callback, token) => {
    const worker = new AlertWorker();
    worker.postMessage({ type: WORKER_SERVER, request: request, requestType: 'object', token });
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
    const worker = new AlertWorker();
    worker.postMessage({ type: WORKER_SERVER, request: requestList, requestType: 'array', token: getToken(self) });
    if (callback) {
        responseListener(self, worker, callback)
    }
    return worker
}


//Not in use, must be reimplemented 
const postMessage = (worker, message) => new Promise((resolve, reject) => {
    const resolution = (event) => {
        worker.removeEventListener('message', resolution)
        if (event.data.status && event.data.status !== 200) {
            if (checkExpiry(self, event.data.message)) {
                reject(event.data)
            }
        }
        else {
            resolve(event.data)
        }
    }
    worker.addEventListener('message', resolution)
    worker.postMessage(message)
})

export const sendAsyncAuthRequest = async (request) => {
    let token = getToken(self)
    if (token) {
        const worker = new AlertWorker();
        let message = { type: WORKER_SERVER, request: request, requestType: 'object', token }
        let mc = await postMessage(worker, message)
        return mc
    }
}