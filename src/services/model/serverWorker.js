import AlertWorker from '../worker/mex.worker.js'
import { WORKER_SERVER } from '../worker/constant.js'
import { checkExpiry } from './serviceMC'

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
            checkExpiry(self, event.data.message)
        }
        else {
            callback(event.data)
        }
    });
}

export const sendRequest = (self, request, callback) => {
    const worker = new AlertWorker();
    worker.postMessage({ type: WORKER_SERVER, request: request, requestType: 'object', token: getToken(self) });
    if (callback) {
        responseListener(self, worker, callback)
    }
    return worker
}

export const sendRequests = (self, requestList, callback) => {
    const worker = new AlertWorker();
    worker.postMessage({ type: WORKER_SERVER, request: requestList, requestType: 'array', token: getToken(self) });
    if (callback) {
        responseListener(self, worker, callback)
    }
    return worker
}