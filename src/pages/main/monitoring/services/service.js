import { redux_org } from "../../../../helper/reduxData";
import { fields } from "../../../../services/model/format";
import { requestAppInstLatency } from "../../../../services/modules/appInst";
import { authSyncRequest, multiAuthSyncRequest, responseValid, showAuthSyncRequest } from "../../../../services/service";
import { showOrganizations } from '../../../../services/modules/organization';
import { processWorker } from "../../../../services/worker/interceptor";
import { timezonePref } from "../../../../utils/sharedPreferences_util";
import { legendKeys, resourceAPIs, showAPIs } from "../helper/constant";
import ShowWorker from '../services/show.worker.js'
import { _orderBy } from "../../../../helper/constant/operators";

export const fetchOrgList = async (self) => {
    let dataList = await showAuthSyncRequest(self, showOrganizations(self))
    if (dataList && dataList.length > 0) {
        return _orderBy(dataList, [item=>item[fields.organizationName].toLowerCase()])
    }
}

export const fetchFlavorBySelection = async (data) => {
    const { worker, dataList, selection } = data
    if (dataList && dataList.length > 0) {
        const { legends, region, resourceType, values } = dataList[0]
        let response = await processWorker(worker, {
            legends,
            region,
            resource: resourceType,
            values,
            selection,
            region,
            timezone: timezonePref(),
            flavorSelection: true
        })
        if (response.status === 200) {
            return { datasets: response.datasets, values, region, legends, resourceType }
        }
    }
}

export const fetchResourceData = async (self, moduleId, data) => {
    const { region, organization, legends, metricRequestData, resourceKey, range, worker, selection } = data
    if (resourceKey.serverRequest && metricRequestData && metricRequestData.length > 0) {
        let data = {}
        data[fields.region] = region
        data[fields.starttime] = range.starttime
        data[fields.endtime] = range.endtime
        data[fields.selector] = resourceKey.serverField
        data[fields.numsamples] = 50
        let request = resourceAPIs(self, resourceKey.serverRequest, data, metricRequestData, organization ? organization[fields.organizationName] : redux_org.nonAdminOrg(self))
        let mc = await authSyncRequest(this, { ...request, format: false })
        if (responseValid(mc)) {
            let response = await processWorker(worker, {
                response: { data: mc.response.data },
                request: request,
                parentId: moduleId,
                metricKeys: legendKeys(moduleId),
                region,
                metric: resourceKey,
                legends: legends,
                selection: selection,
                timezone: timezonePref()
            })
            if (response.status === 200) {
                return response
            }
        }
        return null
    }
}

//Fetch Show API (cloudlet, clusterInst, AppInst based on moduleId)
export const fetchShowData = async (self, moduleId, data) => {
    const { region, organization } = data
    let requestList = showAPIs(moduleId).map(request => {
        return request(self, { region, org: organization[fields.organizationName], type:organization[fields.type]})
    })
    let mcList = await multiAuthSyncRequest(this, requestList, false)
    if (mcList && mcList.length > 0) {
        let worker = ShowWorker()
        let response = await processWorker(worker, {
            requestList,
            parentId: moduleId,
            region,
            mcList,
            metricListKeys: legendKeys(moduleId),
            isOperator: redux_org.isOperator(self)
        })
        worker.terminate()
        if (response.status === 200 && response.list) {
            return { legends: response.data, legendList: response.list }
        }
    }
}

export const requestLantency = async (self, data) => {
    let mc = await requestAppInstLatency(self, data)
    if (responseValid(mc)) {
        self.props.handleAlertInfo('success', mc.response.data.message)
    }
    else {
        if (mc.error && mc.error.response && mc.error.response.data && mc.error.response.data.message)
            self.props.handleAlertInfo('error', mc.error.response.data.message)
    }
}