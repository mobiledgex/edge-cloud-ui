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
        self.props.history.push({
            pathname: '/logout'
        })
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
    sendRequest(self, request, callback)
}

export const updatePwd = (self, data, callback) => {
    let request = { method: NEW_PASSWORD, data: data }
    sendRequest(self, request, callback)
}

export const resetPwd = (self, data, callback) => {
    let request = { method: RESET_PASSWORD, data: data }
    sendRequest(self, request).addEventListener('message', event => {
        callback(event.data)
    });
}

export const sendRequest = (self, request, callback) => {
    let token = getToken(self)
    if (token) {
        const worker = new AlertWorker();
<<<<<<< HEAD
        worker.postMessage({ type: WORKER_SERVER, request: request, requestType: 'object', token});
=======
        worker.postMessage({ type: WORKER_SERVER, request: request, requestType: 'object', token });
>>>>>>> 6f6f80a3629620d037cafbb6f361eb48ca63c5a1
        if (callback) {
            responseListener(self, worker, callback)
        }
        return worker
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