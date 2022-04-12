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


import { endpoint } from '../..'
import { idFormatter } from "../../../helper/formatter";
import { redux_org } from "../../../helper/reduxData";
import { localFields } from '../../fields';
import { authSyncRequest } from "../../service";

const SERVER_FIELD_NAME = 'Name'
const SERVER_FIELD_ORG = 'Org'
const SERVER_FIELD_EMAIL = 'Email'
const SERVER_FIELD_START_SCHEDULE_DATE = 'StartScheduleDate'
const SERVER_FIELD_NEXT_SCHEDULE_DATE = 'NextScheduleDate'
const SERVER_FIELD_SCHEDULE = 'Schedule'
const SERVER_FIELD_TIMEZONE = 'Timezone'

export const keys = () => (
    [
        { field: localFields.name, label: 'Name', serverField: SERVER_FIELD_NAME, sortable: false, visible: true, filter: true, key: true },
        { field: localFields.organizationName, label: 'Organization', serverField: SERVER_FIELD_ORG, sortable: false, visible: true, filter: true, key: true },
        { field: localFields.email, label: 'Email', serverField: SERVER_FIELD_EMAIL, filter: true, visible: true },
        { field: localFields.startdate, label: 'Start Schedule Date', serverField: SERVER_FIELD_START_SCHEDULE_DATE, visible: true, format:true },
        { field: localFields.nextDate, label: 'Next Schedule Date', serverField: SERVER_FIELD_NEXT_SCHEDULE_DATE, visible: true, format:true },
        { field: localFields.schedule, label: 'Interval', serverField: SERVER_FIELD_SCHEDULE, visible: true },
        { field: localFields.timezone, label: 'Timezone', serverField: SERVER_FIELD_TIMEZONE, visible: true },
        { field: localFields.username, label: 'Username', serverField: 'Username', sortable: false, filter: true, visible: true },
        { field: localFields.status, label: 'Last Report Status', serverField: 'Status', visible: true, format: true }
    ]
)

const generateRequestData = (data, isCreate) => {
    let requestData = {}
    requestData[SERVER_FIELD_NAME] = data[localFields.name]
    requestData[SERVER_FIELD_ORG] = data[localFields.organizationName]
    if (isCreate) {
        requestData[SERVER_FIELD_EMAIL] = data[localFields.email]
        requestData[SERVER_FIELD_START_SCHEDULE_DATE] = data[localFields.startdate]
        requestData[SERVER_FIELD_SCHEDULE] = idFormatter.reportInterval(data[localFields.schedule])
        requestData[SERVER_FIELD_TIMEZONE] = data[localFields.timezone]
    }
    return requestData
}

export const showGeneratedReports = async (self, data) => {
    let requestData = {}
    requestData.org = redux_org.nonAdminOrg(self) ? redux_org.nonAdminOrg(self) : data[localFields.org]
    let request = { method: endpoint.SHOW_REPORTS, data: requestData }
    return await authSyncRequest(self, request)
}

export const downloadReport = async (self, data) => {
    let requestData = data
    requestData.org = redux_org.nonAdminOrg(self) ? redux_org.nonAdminOrg(self) : data[localFields.org]
    let request = { method: endpoint.DOWNLOAD_REPORT, data: requestData, responseType: 'arraybuffer', headers : {Accept: 'application/pdf'} }
    return await authSyncRequest(self, request)
}

export const generateReport = async(self, data)=>{
    let requestData = data
    requestData.org = redux_org.nonAdminOrg(self) ? redux_org.nonAdminOrg(self) : data[localFields.org]
    let request = { method: endpoint.GENERATE_REPORT, data: requestData, responseType: 'arraybuffer', headers : {Accept: 'application/pdf'} }
    return await authSyncRequest(self, request)
}

export const showReporter = (self, data) => {
    let requestData = {}
    if (redux_org.nonAdminOrg(self)) {
        requestData.org = redux_org.orgName(self)
    }
    return { method: endpoint.SHOW_REPORTER, data: requestData, keys: keys() }
}

export const createReporter = async (self, data) => {
    let requestData = generateRequestData(data, true)
    let request = { method: endpoint.CREATE_REPORTER, data: requestData }
    return await authSyncRequest(self, request)
}

export const updateReporter = async (self, data) => {
    let requestData = generateRequestData(data, true)
    let request = { method: endpoint.UPDATE_REPORTER, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteReporter = (self, data) => {
    let requestData = generateRequestData(data);
    return { method: endpoint.DELETE_REPORTER, data: requestData, success: `Report Scheduler ${data[localFields.name]} deleted successfully` }
}