import { endpoint, perpetual } from "../../../helper/constant";
import { idFormatter } from "../../../helper/formatter";
import { redux_org } from "../../../helper/reduxData";
import { authSyncRequest } from "../../service";
import * as formatter from '../../model/format'

const fields = formatter.fields;

const SERVER_FIELD_NAME = 'Name'
const SERVER_FIELD_ORG = 'Org'
const SERVER_FIELD_EMAIL = 'Email'
const SERVER_FIELD_START_SCHEDULE_DATE = 'StartScheduleDate'
const SERVER_FIELD_NEXT_SCHEDULE_DATE = 'NextScheduleDate'
const SERVER_FIELD_SCHEDULE = 'Schedule'
const SERVER_FIELD_TIMEZONE = 'Timezone'

export const keys = () => (
    [
        { field: fields.name, label: 'Name', serverField: SERVER_FIELD_NAME, sortable: false, visible: true, filter: true, key: true },
        { field: fields.organizationName, label: 'Organization', serverField: SERVER_FIELD_ORG, sortable: false, visible: true, filter: true, key: true },
        { field: fields.email, label: 'Email', serverField: SERVER_FIELD_EMAIL, filter: true, visible: true },
        { field: fields.startdate, label: 'Start Schedule Date', serverField: SERVER_FIELD_START_SCHEDULE_DATE, visible: true },
        { field: fields.nextDate, label: 'Next Schedule Date', serverField: SERVER_FIELD_NEXT_SCHEDULE_DATE, visible: true },
        { field: fields.schedule, label: 'Interval', serverField: SERVER_FIELD_SCHEDULE, visible: true },
        { field: fields.timezone, label: 'Timezone', serverField: SERVER_FIELD_TIMEZONE, visible: true },
        { field: fields.username, label: 'Username', serverField: 'Username', sortable: false, filter: true, visible: true },
        { field: fields.status, label: 'Last Report Status', serverField: 'Status', visible: true, format: true },
        { field: 'actions', label: 'Actions', visible: true, clickable: true, roles: [perpetual.ADMIN_MANAGER, perpetual.OPERATOR_MANAGER] }
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
        requestData[SERVER_FIELD_TIMEZONE] = data[fields.timezone]
    }
    return requestData
}

export const showGeneratedReports = async (self, data) => {
    let requestData = {}
    requestData.org = redux_org.nonAdminOrg(self) ? redux_org.nonAdminOrg(self) : data[fields.org]
    let request = { method: endpoint.SHOW_REPORTS, data: requestData }
    return await authSyncRequest(self, request)
}

export const downloadReport = async (self, data) => {
    let requestData = data
    requestData.org = redux_org.nonAdminOrg(self) ? redux_org.nonAdminOrg(self) : data[fields.org]
    let request = { method: endpoint.DOWNLOAD_REPORT, data: requestData, responseType: 'arraybuffer', headers : {Accept: 'application/pdf'} }
    return await authSyncRequest(self, request)
}

export const generateReport = async(self, data)=>{
    let requestData = data
    requestData.org = redux_org.nonAdminOrg(self) ? redux_org.nonAdminOrg(self) : data[fields.org]
    let request = { method: endpoint.GENERATE_REPORT, data: requestData, responseType: 'arraybuffer', headers : {Accept: 'application/pdf'} }
    return await authSyncRequest(self, request)
}

export const showReporter = (data) => {
    return { method: endpoint.SHOW_REPORTER, data: undefined, keys: keys() }
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
    return { method: endpoint.DELETE_REPORTER, data: requestData, success: `Report Scheduler ${data[fields.name]} deleted successfully` }
}