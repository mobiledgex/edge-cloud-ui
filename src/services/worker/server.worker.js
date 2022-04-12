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

/* eslint-disable */
import axios from 'axios';
import { fetchHeader, fetchPath } from '../config';
import { formatData } from '../format/format'

const errorResponse = (error) => {
    let response = error.response
    if (response) {
        let status = response.status
        let message = response.data.message
        self.postMessage({ status, message })
    }
    else {
        self.postMessage({ status: 400, message: 'Unknown' })
    }
}
const fetchResponse = (worker) => {
    let request = worker.request
    axios.post(fetchPath(request), request.data,
        {
            headers: fetchHeader(worker)
        }).then((response) => {
            if (response) {
                self.postMessage(formatData(request, response))
            }
        }).catch((error) => {
            errorResponse(error)
        })
}

const fetchResponses = (worker) => {
    let requestList = worker.request
    let promise = []
    requestList.map((request) => {
        promise.push(axios.post(fetchPath(request), request.data,
            {
                headers: fetchHeader(worker)
            }))
    })
    axios.all(promise)
        .then(function (responseList) {
            let formattedResponseList = [];
            responseList.map((response, i) => {
                let request = requestList[i]
                formattedResponseList.push(formatData(request, response));
            })
            self.postMessage(formattedResponseList)
        })
        .catch(function (error) {
            errorResponse(error)
        })
}

const fetch = (worker) => {
    switch (worker.requestType) {
        case 'object':
            fetchResponse(worker)
            break;
        case 'array':
            fetchResponses(worker)
            break;
    }
}

self.addEventListener("message", (event)=>{
    fetch(event.data)
});