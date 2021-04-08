import { getPath, getHeader, formatData } from '../model/endpoints'
import axios from 'axios';

const errorResponse = (error) => {
    let response = error.response
    if (response) {
        let status = response.status
        let message = response.data.message
        return { status, message }
    }
    else {
        return { status: 400, message: 'Unknown' }
    }
}

export const sendRequest = async (worker) => {
    let request = worker.request
    try {
        let response = await axios.post(getPath(request), request.data, { headers: getHeader(worker) })
        return formatData(request, response)
    }
    catch (e) {
        return errorResponse(e)
    }
}