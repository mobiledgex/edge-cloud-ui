import cloneDeep from "lodash/cloneDeep";
import * as serviceMC from "../../../../services/model/serviceMC";
import * as Cloudlet from "./model/cloudlet";
import * as Metrics from "./model/metrics";
import * as Appinst from "./model/appinst";
import * as Client from "./model/client";
import * as Events from "./model/events";
import * as EventsCluster from "./model/eventsCluster";
import { yesterdayWithCurrentUTC, todayUTC } from "../hooks/timeRangeFilter";
import { getApplyFilter } from "../hooks/FilterMenu";

const savedCloudletData = [];
const savedAppinstData = [];

interface MetricsParmaType {
    id: string;
    method: string | null;
    chartType: string;
    type: string;
    sizeInfo: Object;
    self: any;
}
const rangeTime = range => {
    let time = null;
    if (range === "start") {
        time = yesterdayWithCurrentUTC;
    } else {
        time = todayUTC;
    }
    return time;
};

const setRemote = result => { };
const getArgs = info => {
    if (info.method === serviceMC.getEP().EVENT_CLOUDLET) {
        return {
            region: info.pRegion,
            cloudlet: {
                organization: info.selectOrg,
                name: info.cloudletSelectedOne,
            },
            last: info.last,
        };
    }
    if (info.method === serviceMC.getEP().METRICS_CLOUDLET) {
        return {
            token,
            params: {
                region: info.pRegion,
                cloudlet: {
                    organization: info.selectOrg,
                    name: info.cloudletSelectedOne,
                },
                last: 1,
                selector: "*",
            },
        };
    }
};

const getCluster = info => {
    if (info.method === serviceMC.getEP().EVENT_CLUSTER) {
        return {
            region: info.pRegion,
            clusterinst: {
                organization: info.selectOrg,
                name: info.clusterSelectedOne,
            },
            starttime: info.starttime,
            endtime: info.endtime,
        };
    }
};

/** *********************************
 * LIST CLOUDLET
 *********************************** */
const getListCloud = (self, params) => {
    /* First, need to get data for all cloudltes */
    Cloudlet.getCloudletList(self, params);
    /* Through the result to the ContainerWrapper.onLoadComplete after success execute getCloudletList */
};
/** *********************************
 * LIST CLUSTER
 *********************************** */
const getListCluster = async (self, params) => {
    const result = await Metrics.getClusterList(self, params);
    return result;
};
/** *********************************
 * LIST APPINSTANCE
 *********************************** */
const getListAppinst = async (self, params) =>
    /* First, need to get data for all appinstance */
    await Appinst.getAppinstanceList(self, params);


/** *********************************
 * METRICS CLOUDLET
 * store : will be change to @Rahul's framwork
 * token :
 *********************************** */
const store = (localStorage && localStorage.PROJECT_INIT) ? JSON.parse(localStorage.PROJECT_INIT) : null;
let token = store ? store.userToken : "null";
const getMetricsCloudlet = async (self, params) => {
    /**
    * Continue, get events of cloudlets */
    const requestData = cloudletInfo => ({
        token,
        pRegion: cloudletInfo.region,
        selectOrg: cloudletInfo.operatorName,
        method: serviceMC.getEP().METRICS_CLOUDLET,
        cloudletSelectedOne: cloudletInfo.cloudletName,
        last: 10,
    });

    // TODO : 페이지 개수만큼 데이터 호출
    return Promise.all(
        params.cloudlets.map(async cloudlet => Cloudlet.getCloudletMetrics(
            self,
            requestData(cloudlet),
            params.chartType,
        )),
    );
};
/** *********************************
 * METRICS CLIENT

* 1. 모든 앱 리스트 가져오기
* 2. 지역과 조직과 앱의 정보와 메소드를 통하여 클라이언트의 정보를 가져오면
* 3.
 *********************************** */
const getMetricsClient = async (self, params) => {
    /* Continue, get events of cloudlets */
    const requestData = appinstInfo => ({
        token,
        pRegion: appinstInfo.region,
        selectOrg: appinstInfo.organizationName,
        method: serviceMC.getEP().METRICS_CLIENT,
        appinstSelectedOne: appinstInfo.appName,
        version: appinstInfo.version,
        last: 10,
    });

    // params.appinsts.map(async appinst => {
    //     const response = await Client.getClientMetrics(
    //         self,
    //         requestData(appinst),
    //     );
    //     /** * self : parent is the scope of <<< ContainerWrapper.js >>> */
    //     console.log("20200521 client >>>> response for get metrics client... ", response, ": method = ", params.method);
    //     self.onReceiveResultClient(response, self);
    // });
    console.log("20200610 request getMetricsClient ==", params.appinsts);

    // TODO : 페이지 개수만큼 데이터 호출
    return Promise.all(
        params.appinsts.map(async appinst => Client.getClientMetrics(
            self,
            requestData(appinst),
            params.chartType,
        )),
    );
};


/** *********************************
 * EVENT CLOUDLET
 *********************************** */
const getEventCloudlet = async (self, params) => {
    /* Continue, get events of cloudlets */
    // alert(JSON.stringify(params))
    const execrequest = cloudletInfo => getArgs({
        pRegion: cloudletInfo.region,
        selectOrg: cloudletInfo.operatorName,
        method: serviceMC.getEP().EVENT_CLOUDLET,
        cloudletSelectedOne: cloudletInfo.cloudletName,
        starttime: rangeTime("start"),
        endtime: rangeTime("end")
    });

    const store = JSON.parse(localStorage.PROJECT_INIT);
    const token = store ? store.userToken : "null";
    const requestData = cloudlet => ({
        token,
        method: serviceMC.getEP().EVENT_CLOUDLET,
        data: execrequest(cloudlet),
    });

    return Promise.all(
        params.cloudlets.map(async (cloudlet, i) => Events.getCloudletEvent(
            self,
            requestData(cloudlet),
            params.chartType,
        )),
    );
};


/** *********************************
 * EVENT CLUSTER
 *********************************** */
const getEventCluster = async (self, params) => {
    const selectedFilter = getApplyFilter();
    let selectedCluster = "";
    if (selectedFilter && selectedFilter.cluster) {
        selectedCluster = selectedFilter.cluster.value;
    }
    console.log('origin params', params, ": selectedCluster =", selectedCluster);
    const cloneParams = cloneDeep(params);
    if (selectedCluster !== "") {
        const findIdx = cloneParams.clusters.findIndex(x => x.clusterName === selectedCluster);
        cloneParams.clusters = [cloneParams.clusters[findIdx > 0 ? findIdx : 0]];
    }


    console.log('filtered params', cloneParams, ": selectedCluster =", selectedCluster);

    const execrequest = clusterInfo => getCluster({
        pRegion: clusterInfo.region,
        selectOrg: clusterInfo.organizationName,
        method: serviceMC.getEP().EVENT_CLUSTER,
        clusterSelectedOne: clusterInfo.clusterName,
        starttime: rangeTime("start"),
        endtime: rangeTime("end")
        // last: 10,
    });
    const store = JSON.parse(localStorage.PROJECT_INIT);
    const token = store ? store.userToken : "null";
    const requestData = cluster => ({
        token,
        method: serviceMC.getEP().EVENT_CLUSTER,
        data: execrequest(cluster),
    });


    // TODO : 페이지 개수만큼 데이터 호출
    return Promise.all(
        cloneParams.clusters.map(async cluster => EventsCluster.getClusterEvent(
            self,
            requestData(cluster),
            cloneParams.chartType,
        )),
    );



};

export const getPrepareList = async (defaultValue: MetricsParmaType, self: any) => {
    let result = null;
    switch (defaultValue.method) {
        case serviceMC.getEP().SHOW_CLOUDLET: result = await getListCloud(self, defaultValue); break;
        case serviceMC.getEP().SHOW_CLUSTER_INST: result = await getListCluster(self, defaultValue); break;
        case serviceMC.getEP().SHOW_APP_INST: result = await getListAppinst(self, defaultValue); break;
        default: // ;
    }
    return result;
};

export const MetricsService = async (defaultValue: MetricsParmaType, self: any) => {
    let result = null;
    console.log("20200612 request service index == ", defaultValue)
    // this.props.handleLoadingSpinner(true);
    // switch (defaultValue.method) {
    //     case serviceMC.getEP().COUNT_CLUSTER: result = await getListCluster(self, defaultValue); return result;
    //     case serviceMC.getEP().EVENT_CLOUDLET: result = await getEventCloudlet(self, defaultValue); return result;
    //     case serviceMC.getEP().EVENT_CLUSTER: result = await getEventCluster(self, defaultValue); return result;
    //     case serviceMC.getEP().METRICS_CLOUDLET: result = await getMetricsCloudlet(self, defaultValue); return result;
    //     case serviceMC.getEP().METRICS_CLIENT: result = await getMetricsClient(self, defaultValue); return result;
    //     default: return null;
    // }

    if (defaultValue.method === serviceMC.getEP().COUNT_CLUSTER) {
        result = await getListCluster(self, defaultValue);
        return result;
    }
    if (defaultValue.method === serviceMC.getEP().EVENT_CLOUDLET) {
        result = await getEventCloudlet(self, defaultValue);
        return result;
    }
    if (defaultValue.method === serviceMC.getEP().EVENT_CLUSTER) {
        result = await getEventCluster(self, defaultValue);
        return result;
    }
    if (defaultValue.method === serviceMC.getEP().METRICS_CLOUDLET) {
        result = await getMetricsCloudlet(self, defaultValue);
        return result;
    }
    if (defaultValue.method === serviceMC.getEP().METRICS_CLIENT) {
        result = await getMetricsClient(self, defaultValue);
        return result;
    }

};


// / get saved data
export const getCloudletData = () => (
    savedCloudletData
);
export const getAppinstData = () => (
    savedAppinstData
);
