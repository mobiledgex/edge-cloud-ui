/* eslint-disable */
import { getPath, getHeader, formatData } from '../model/endpoints'
import axios from 'axios';

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
    axios.post(getPath(request), request.data,
        {
            headers: getHeader(worker)
        }).then((response) => {
            if (response && response.data) {
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
        promise.push(axios.post(getPath(request), request.data,
            {
                headers: getHeader(worker)
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

export const fetch = (worker) => {
    switch (worker.requestType) {
        case 'object':
            fetchResponse(worker)
            break;
        case 'array':
            fetchResponses(worker)
            break;
    }
}