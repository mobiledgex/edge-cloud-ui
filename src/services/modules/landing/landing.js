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

import * as endpoint from '../../endpoint/nonauth';
import { errorResponse, fetchHttpURL, instance, responseValid, showProgress } from '../../config';

export const syncRequest = async (self, request) => {
    let mc = {}
    try {
        showProgress(self, request)
        const response = await instance(self, request, false).post(fetchHttpURL(request), request.data)
        mc = { request, response: { status: response?.status, data: response?.data } }
    }
    catch (error) {
        errorResponse(self, request, error, undefined, false)
        mc = { request, error }
    }
    showProgress(self)
    return mc
}

export const sendVerify = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.RESEND_VERIFY, data: data })
    return responseValid(mc)
}

export const verifyEmail = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.VERIFY_EMAIL, data: data })
    return mc
}

export const createUser = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.CREATE_USER, data: data })
    return mc
}

export const login = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.LOGIN, data: data })
    return mc
}

export const resetPasswordRequest = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.RESET_PASSWORD_REQUEST, data: data })
    return responseValid(mc)
}

export const publicConfig = async (self) => {
    return await syncRequest(self, { method: endpoint.PUBLIC_CONFIG })
}

export const resetPwd = async (self, data) => {
    let request = { method: endpoint.RESET_PASSWORD, data: data }
    return await syncRequest(self, request)
}

