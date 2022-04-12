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

import { validateExpiry } from "../config"

export const postMessage = (worker, message, self) => new Promise((resolve, reject) => {
    const resolution = (event) => {
        let response = event.data
        worker.removeEventListener('message', resolution)
        if (response && response.status === 200) {
            resolve(response)
        }
        else {
            if (validateExpiry(self, response.message)) {
                reject(response)
            }
        }
    }
    worker.addEventListener('message', resolution)
    worker.postMessage(message)
})

export const processWorker = async (self, worker, object) => {
    try {
        return await postMessage(worker, { ...object }, self)
    }
    catch (e) {
        return undefined
    }
}