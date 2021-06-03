import { ADMIN_MANAGER } from "../../constant";
import { idFormatter, labelFormatter } from "../../helper/formatter";
import { time, FORMAT_FULL_DATE, dateToOffset, dateToZoneName } from "../../utils/date_util";
import { CREATE_REPORTER, DELETE_REPORTER, SHOW_REPORTER, UPDATE_REPORTER } from "./endPointTypes";
import * as formatter from './format'
import { sendRequest } from "./serverData";

const fields = formatter.fields;

const SERVER_FIELD_NAME = 'Name'
const SERVER_FIELD_ORG = 'Org'
const SERVER_FIELD_EMAIL = 'Email'
const SERVER_FIELD_START_SCHEDULE_DATE = 'StartScheduleDate'
const SERVER_FIELD_NEXT_SCHEDULE_DATE = 'NextScheduleDate'
const SERVER_FIELD_SCHEDULE = 'Schedule'

export const keys = () => (
    [
        { field: fields.name, label: 'Name', serverField: SERVER_FIELD_NAME, sortable: false, visible: true, filter: true, key: true },
        { field: fields.organizationName, label: 'Organization', serverField: SERVER_FIELD_ORG, sortable: false, visible: true, filter: true, key: true },
        { field: fields.email, label: 'Email', serverField: SERVER_FIELD_EMAIL, filter: true, visible: true },
        { field: fields.startdate, label: 'Start Schedule Date', serverField: SERVER_FIELD_START_SCHEDULE_DATE, visible: true },
        { field: fields.nextDate, label: 'Next Schedule Date', serverField: SERVER_FIELD_NEXT_SCHEDULE_DATE, visible: true },
        { field: fields.schedule, label: 'Interval', serverField: SERVER_FIELD_SCHEDULE, visible: true },
        { field: fields.timezone, label: 'Timezone', visible: true },
        { field: fields.username, label: 'Username', serverField: 'Username', sortable: false, filter: true, visible: true },
        { field: fields.status, label: 'Status', serverField: 'Status', visible: true },
        { field: 'actions', label: 'Actions', visible: true, clickable: true, roles: [ADMIN_MANAGER] }
    ]
)

const generateRequestData = (data, isCreate) => {
    let requestData = {}
    requestData[SERVER_FIELD_NAME] = data[fields.name]
    requestData[SERVER_FIELD_ORG] = data[fields.organizationName]
    if (isCreate) {
        requestData[SERVER_FIELD_EMAIL] = data[fields.email]
        requestData[SERVER_FIELD_START_SCHEDULE_DATE] = data[fields.startdate]
        requestData[SERVER_FIELD_SCHEDULE] = idFormatter.reportInterval(data[fields.schedule])
    }
    return requestData
}

export const showReporter = (data) => {
    return { method: SHOW_REPORTER, data: undefined, keys: keys() }
}

export const createReporter = async (self, data) => {
    let requestData = generateRequestData(data, true)
    let request = { method: CREATE_REPORTER, data: requestData }
    return await sendRequest(self, request)
}

export const updateReporter = async (self, data) => {
    let requestData = generateRequestData(data, true)
    let request = { method: UPDATE_REPORTER, data: requestData }
    return await sendRequest(self, request)
}

export const deleteReporter = (self, data) => {
    let requestData = generateRequestData(data);
    return { method: DELETE_REPORTER, data: requestData, success: `Report Scheduler ${data[fields.name]} deleted successfully` }
}

const customData = (value) => {
    value[fields.schedule] = labelFormatter.reporterInterval(value[fields.schedule])
    value[fields.timezone] = dateToOffset(value[fields.startdate])
    value[fields.startdate] = time(FORMAT_FULL_DATE, value[fields.startdate])
    value[fields.nextDate] = time(FORMAT_FULL_DATE, value[fields.nextDate])
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData)
}