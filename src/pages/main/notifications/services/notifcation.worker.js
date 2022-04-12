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

import { validateExpiry } from '../../../../services/config'
import { sendRequest } from '../../../../services/worker/fetch'

let intervalId = undefined

const generateRequest = async (worker) => {
    const { requestList } = worker
    let alertList = []
    let valid = true
    await Promise.all(requestList.map(async (request) => {
        let mc = await sendRequest({ ...worker, request })
        if (mc) {
            if (mc.response?.status === 200) {
                let data = mc.response.data
                if (data?.length > 0) {
                    alertList = [...alertList, ...data]
                }
            }
            else {
                if (!validateExpiry(undefined, mc.message)) {
                    valid = false
                    postMessage({ status: 401, message: mc.message })
                    clearInterval(intervalId)
                }
            }
        }
    }))
    if (valid) {
        postMessage({ status: 200, data: { alertList } })
    }
}

export const process = (worker) => {
    generateRequest(worker)
    intervalId = setInterval(() => {
        generateRequest(worker)
    }, 30000);
}

addEventListener("message", (event) => {
    process(event.data)
});