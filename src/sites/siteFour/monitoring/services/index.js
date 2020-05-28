import * as serviceMC from "../../../../services/model/serviceMC";
import * as serverData from "../../../../services/model/serverData";
import * as Cloudlet from "./model/cloudlet";
import * as Metrics from "./model/metrics";
import * as Appinst from "./model/appinst";
import * as Client from "./model/client";
import * as Events from "./model/events";

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
    } if (info.method === serviceMC.getEP().METRICS_CLOUDLET) {
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

    const execrequest = cloudletInfo => getArgs({
        pRegion: cloudletInfo.region,
        selectOrg: cloudletInfo.operatorName,
        method: serviceMC.getEP().EVENT_CLOUDLET,
        cloudletSelectedOne: cloudletInfo.cloudletName,
        last: 1,
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

export const getPrepareList = async (defaultValue: MetricsParmaType, self: any) => {
    if (defaultValue.method === serviceMC.getEP().SHOW_CLOUDLET) {
        const result = await getListCloud(self, defaultValue);
        return result;
    }
    if (defaultValue.method === serviceMC.getEP().SHOW_APP_INST) {
        const result = await getListAppinst(self, defaultValue);
        return result;
    }
};

export const MetricsService = async (defaultValue: MetricsParmaType, self: any) => {
    let result = null;
    // this.props.handleLoadingSpinner(true);
    switch (defaultValue.method) {
        case serviceMC.getEP().COUNT_CLUSTER: result = await getListCluster(self, defaultValue); return result;
        case serviceMC.getEP().EVENT_CLOUDLET: result = await getEventCloudlet(self, defaultValue); return result;
        case serviceMC.getEP().METRICS_CLOUDLET: result = await getMetricsCloudlet(self, defaultValue); return result;
        case serviceMC.getEP().METRICS_CLIENT: result = await getMetricsClient(self, defaultValue); return result;
        default: return null;
    }
};


// / get saved data
export const getCloudletData = () => (
    savedCloudletData
);
export const getAppinstData = () => (
    savedAppinstData
);
