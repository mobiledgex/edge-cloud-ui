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