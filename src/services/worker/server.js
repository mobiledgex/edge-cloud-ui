/* eslint-disable */
import { getPath, getHeader, formatData } from '../model/endpoints'
import axios from 'axios';

const fetchResponse = (request) => {
    axios.post(getPath(request), request.data,
        {
            headers: getHeader(request)
        }).then((response) => {
            if (response && response.data) {
                self.postMessage(formatData(request, response))
            }
        }).catch((error) => {
            console.log('error', error.response)
        })
}

const fetchResponses = (requestList) => {
    let promise = []
    requestList.map((request) => {
        promise.push(axios.post(getPath(request), request.data,
            {
                headers: { 'Authorization': `Bearer ${request.token}` }
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
            console.log('error', error.response)
        })
}

export const fetch = (worker) => {
    let request = worker.request
    switch (worker.requestType) {
        case 'object':
            fetchResponse(request)
            break;
        case 'array':
            fetchResponses(request)
            break;
    }
}