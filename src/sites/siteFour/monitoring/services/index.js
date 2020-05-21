import * as serviceMC from "../../../../services/model/serviceMC";
import * as serverData from "../../../../services/model/serverData";
import * as Cloudlet from "./model/cloudlet";
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

const setRemote = (result) => { };
const getArgs = (info) => {
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
    const requestData = (cloudletInfo) => ({
        token,
        pRegion: cloudletInfo.region,
        selectOrg: cloudletInfo.operatorName,
        method: serviceMC.getEP().METRICS_CLOUDLET,
        cloudletSelectedOne: cloudletInfo.cloudletName,
        last: 10,
    });

    params.cloudlets.map(async (cloudlet, i) => {
        const response = await Cloudlet.getCloudletMetrics(
            self,
            requestData(cloudlet),
        );
        /** * self : parent is the scope of <<< ContainerWrapper.js >>> */
        self.onReceiveResult(response, self);
    });
};
/** *********************************
 * METRICS CLIENT

* 1. 모든 앱 리스트 가져오기
* 2. 지역과 조직과 앱의 정보와 메소드를 통하여 클라이언트의 정보를 가져오면
* 3.
 *********************************** */
const getMetricsClient = async (self, params) => {
    console.log("20200521 get metrics in services... ", params);
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

    params.appinsts.map(async appinst => {
        const response = await Client.getClientMetrics(
            self,
            requestData(appinst),
        );
        if (response && response.values) self.onReceiveResult(response, self);
    });
};


/** *********************************
 * EVENT CLOUDLET
 *********************************** */
const getEventCloudlet = async (self, params) => {
    /* Continue, get events of cloudlets */

    const execrequest = (cloudletInfo) => getArgs({
        pRegion: cloudletInfo.region,
        selectOrg: cloudletInfo.operatorName,
        method: serviceMC.getEP().EVENT_CLOUDLET,
        cloudletSelectedOne: cloudletInfo.cloudletName,
        last: 1,
    });

    const store = JSON.parse(localStorage.PROJECT_INIT);
    const token = store ? store.userToken : "null";
    const requestData = (cloudlet) => ({
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
    if (defaultValue.method === serviceMC.getEP().EVENT_CLOUDLET) {
        // this.props.handleLoadingSpinner(true);
        // 잠시 막음
        getEventCloudlet(defaultValue.self, defaultValue).then(async (data) => {
            self.onReceiveResult(data, self);
        });
    }
    if (defaultValue.method === serviceMC.getEP().METRICS_CLOUDLET) {
        // 잠시 막음
        const result = await getMetricsCloudlet(self, defaultValue);
        return result;
    }

    if (defaultValue.method === serviceMC.getEP().METRICS_CLIENT) {
        // 잠시 막음
        const result = await getMetricsClient(self, defaultValue);
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
