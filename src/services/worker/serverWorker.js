/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ServerWorker from './server.worker.js'
import { fetchToken, validateExpiry } from '../config.js'

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
