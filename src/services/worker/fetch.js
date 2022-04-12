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

import axios from 'axios';
import { formatData } from '../format/format'
import { fetchHeader, fetchPath } from '../config';

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
        let response = await axios.post(fetchPath(request), request.data, { headers: fetchHeader(worker) })
        return formatData(request, response)
    }
    catch (e) {
        return errorResponse(e)
    }
}