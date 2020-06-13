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

/*
[{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"autoclusterautomation-api-app","uri":"autoclusterautomation-api-app.automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1590522068,"nanos":617799390},"status":{},"uuid":"edcee52d-30ef-483d-b556-9c5357ec7222","region":"EU"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"cluster1591857184-305962","uri":"cluster1591857184-305962.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591857409,"nanos":153658551},"status":{},"uuid":"2ae0b05c-cb68-49b8-b63b-565ca0a7118e","region":"EU"},{"organizationName":"MobiledgeX","appName":"NFSAutoProvision","version":"1.0","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"autoclusterautomation-api-app","uri":"autoclusterautomation-api-app.automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","flavorName":"x1.medium","revision":"2020-05-16T060202","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1590522228,"nanos":339413273},"status":{},"uuid":"c7d1e9ea-bf33-4a9c-b82a-965824c691ee","region":"EU"},{"organizationName":"MobiledgeX","appName":"serverhelm","version":"1","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"andyclusterhelm","uri":"andyclusterhelm.automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2016,"public_port":2016}],"flavorName":"automation_api_flavor","revision":"2020-05-26T161046","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1590509468,"nanos":646167580},"status":{},"uuid":"4ea09b7e-c978-40c6-bb7f-0bbb64c83556","region":"EU"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"andycloud","cloudletLocation":{"latitude":1,"longitude":1,"timestamp":{}},"clusterdeveloper":"testmonitor","clusterName":"autoclusterk8sangshu","uri":"autoclusterk8sangshu.andycloud.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591259822,"nanos":933896249},"status":{},"uuid":"68382c59-fa91-4b7b-9919-3a550c6b5f1b","region":"EU"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"cluster1590616334-733264","uri":"cluster1590616334-733264.automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1590617252,"nanos":618066192},"status":{},"uuid":"edc1bc44-993a-45d0-8d2e-54c31b86fe7a","region":"EU"},{"organizationName":"MobiledgeX","appName":"andyk8smanifestandimage","version":"1","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"andy1","uri":"andy1.automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2016,"public_port":2016,"fqdn_prefix":"server-ping-threaded-udptcphttp-tcpservice."}],"flavorName":"automation_api_flavor","state":5,"powerState":3,"runtimeInfo":{"container_ids":["server-ping-threaded-udptcphttp-deployment-855fb6fdc8-kpsk5"]},"createdAt":{"seconds":1590614526,"nanos":519965029},"status":{},"uuid":"5b9d83e4-9735-4bdb-9bf1-067d57f053fe","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"app1591856855-3526673","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"dummycluster","uri":"mobiledgexapp1591856855-352667310.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2016,"public_port":2016},{"proto":2,"internal_port":2015,"public_port":2015}],"flavorName":"flavor1591856855-3526673","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591856863,"nanos":333893745},"status":{},"uuid":"cef22f82-7c6a-4811-896f-021cbfc07879","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"automation_api_app","version":"1.0","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"andycluster","uri":"andycluster.automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":8085,"public_port":8085,"fqdn_prefix":"automation-api-app-tcp."},{"proto":2,"internal_port":2016,"public_port":2016,"fqdn_prefix":"automation-api-app-udp."},{"proto":1,"internal_port":2015,"public_port":2015,"fqdn_prefix":"automation-api-app-tcp."}],"flavorName":"automation_api_flavor","revision":"2020-04-29T191444","state":5,"powerState":3,"runtimeInfo":{"container_ids":["automation-api-app-deployment-979bc4d59-lqdsl"]},"createdAt":{"seconds":1590516110,"nanos":61768667},"status":{},"uuid":"ca89fe89-2804-47de-b297-37f1724b2dde","region":"EU"},{"organizationName":"MobiledgeX","appName":"andyportserver","version":"1.0","operatorName":"TDG","cloudletName":"verificationCloudlet","cloudletLocation":{"latitude":53.551085,"longitude":9.993682},"clusterdeveloper":"MobiledgeX","clusterName":"andydedicatedprivacy","uri":"andydedicatedprivacy.verificationcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":3015,"public_port":3015}],"flavorName":"automation_api_flavor","revision":"2020-05-12T221046","state":5,"powerState":3,"runtimeInfo":{"container_ids":["andyportserver10"]},"createdAt":{"seconds":1589331200,"nanos":678000017},"status":{},"uuid":"ca9bca15-4145-4b84-87d6-f82d0eff90ae","region":"EU"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"testmonitor","clusterName":"locustk8scluster","uri":"locustk8scluster.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591911621,"nanos":295164331},"status":{},"uuid":"4a01eed7-4f02-46e4-a7db-2b4b23c484f8","region":"EU"},{"organizationName":"MobiledgeX","appName":"app1591856566-3881478","version":"2.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"cluster1591856566-3881478","uri":"cluster1591856566-3881478.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2017,"public_port":2017},{"proto":2,"internal_port":2018,"public_port":2018}],"flavorName":"flavor1591856566-3881478","state":5,"powerState":3,"runtimeInfo":{"container_ids":["nginxapp1591856566-388147820","envoyapp1591856566-388147820","app1591856566-388147820","nginxapp1591856566-388147810","envoyapp1591856566-388147810","app1591856566-388147810"]},"createdAt":{"seconds":1591856686,"nanos":230541249},"status":{},"uuid":"736edc79-b1a5-4963-b3aa-a8868b402985","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"app1591857184-305962","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"cluster1591857184-305962","uri":"automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2015,"public_port":2015,"fqdn_prefix":"app1591857184-305962-tcp."},{"proto":2,"internal_port":2016,"public_port":2016,"fqdn_prefix":"app1591857184-305962-udp."}],"flavorName":"flavor1591857184-305962","state":5,"powerState":3,"runtimeInfo":{"container_ids":["app1591857184-305962-deployment-79d6995dcb-bjcvl"]},"createdAt":{"seconds":1591857411,"nanos":866599964},"status":{},"uuid":"f6380da8-9e7d-4fab-848b-92981b0d6ad7","region":"EU","revision":"0"},{"organizationName":"testmonitor","appName":"iperf4","version":"v1","operatorName":"TDG","cloudletName":"andycloud","cloudletLocation":{"latitude":1,"longitude":1,"timestamp":{}},"clusterdeveloper":"testmonitor","clusterName":"autoclusteriperf4","uri":"andycloud.tdg.mobiledgex.net","liveness":"Static","flavorName":"automation_api_flavor","ipAccess":"Shared","state":5,"powerState":3,"runtimeInfo":{"container_ids":["iperf-server-deployment-c7846cbcd-v2wjq"]},"createdAt":{"seconds":1588732796,"nanos":118040712},"status":{},"uuid":"2f0ff299-e1e6-46a3-9569-9983d72fece7","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"AppMetricsDocker1591803892-377859docker","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"cluster-1591803892-377859-docker","uri":"cluster-1591803892-377859-docker.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2015,"public_port":2015},{"proto":2,"internal_port":2015,"public_port":2015}],"flavorName":"flavor1591803892-377859","state":5,"powerState":3,"runtimeInfo":{"container_ids":["nginxappmetricsdocker1591803892-377859docker10","envoyappmetricsdocker1591803892-377859docker10","appmetricsdocker1591803892-377859docker10"]},"createdAt":{"seconds":1591803965,"nanos":61676506},"status":{},"uuid":"298ce7e5-b0d5-44fd-9266-6e08604b641d","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"AppMetricsDocker1591803892-377859docker","version":"2.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"cluster-1591803892-377859-docker","uri":"cluster-1591803892-377859-docker.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2017,"public_port":2017},{"proto":2,"internal_port":2018,"public_port":2018}],"flavorName":"flavor1591803892-377859","state":5,"powerState":3,"runtimeInfo":{"container_ids":["nginxappmetricsdocker1591803892-377859docker20","envoyappmetricsdocker1591803892-377859docker20","appmetricsdocker1591803892-377859docker20","nginxappmetricsdocker1591803892-377859docker10","envoyappmetricsdocker1591803892-377859docker10","appmetricsdocker1591803892-377859docker10"]},"createdAt":{"seconds":1591804020,"nanos":835374849},"status":{},"uuid":"4a3fabb0-82df-424b-9976-9b9e44d20e48","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"andycluster","uri":"andycluster.automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1590515781,"nanos":159910861},"status":{},"uuid":"129972a6-b8e9-4f16-97e9-2bee994fee3b","region":"EU"},{"organizationName":"MobiledgeX","appName":"automation-api-app","version":"1.0","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"autoclusterautomation-api-app","uri":"automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":8085,"public_port":8085,"fqdn_prefix":"automation-api-app-tcp."},{"proto":2,"internal_port":2015,"public_port":2015,"fqdn_prefix":"automation-api-app-udp."},{"proto":1,"internal_port":2016,"public_port":2016,"fqdn_prefix":"automation-api-app-tcp."}],"flavorName":"automation_api_flavor","ipAccess":"Shared","revision":"2020-05-26T190706","state":5,"powerState":3,"runtimeInfo":{"container_ids":["automation-api-app-deployment-6dbbfbbdc5-4k97s"]},"createdAt":{"seconds":1590522068,"nanos":556276570},"status":{},"uuid":"58572e32-87b1-4244-b58c-56aaec040c50","region":"EU"},{"organizationName":"MobiledgeX","appName":"app1591857085-2195094","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"dummycluster","uri":"mobiledgexapp1591857085-219509410.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2016,"public_port":2016},{"proto":2,"internal_port":2015,"public_port":2015},{"proto":1,"internal_port":8085,"public_port":8085},{"proto":1,"internal_port":22,"public_port":22}],"flavorName":"flavor1591857085-2195094","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591857190,"nanos":761459282},"status":{},"uuid":"4631aea7-9310-482a-a4bc-9f144f018a98","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"app1591857402-0959306","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"dummycluster","uri":"mobiledgexapp1591857402-095930610.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2016,"public_port":2016},{"proto":2,"internal_port":2015,"public_port":2015}],"flavorName":"flavor1591857402-0959306","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591857405,"nanos":978266094},"status":{},"uuid":"3d531d69-35d1-4b2b-881e-6bc8a81a3b7d","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"AppMetricsDocker1591802581-6760042docker","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"cluster-1591802581-6760042-docker","uri":"cluster-1591802581-6760042-docker.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2015,"public_port":2015},{"proto":2,"internal_port":2015,"public_port":2015}],"flavorName":"flavor1591802581-6760042","state":5,"powerState":3,"runtimeInfo":{"container_ids":["nginxappmetricsdocker1591802581-6760042docker10","envoyappmetricsdocker1591802581-6760042docker10","appmetricsdocker1591802581-6760042docker10"]},"createdAt":{"seconds":1591802653,"nanos":125156354},"status":{},"uuid":"3be01236-d6ff-456d-b67c-abaf970d30db","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"andy1","uri":"andy1.automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1590612410,"nanos":2401719},"status":{},"uuid":"3fc3bee8-0c62-4f69-b7ca-02a4d3cfbc85","region":"EU"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"andycloud","cloudletLocation":{"latitude":1,"longitude":1,"timestamp":{}},"clusterdeveloper":"testmonitor","clusterName":"autoclusteriperf4","uri":"autoclusteriperf4.andycloud.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1588732796,"nanos":223150444},"status":{},"uuid":"b8767259-2302-4002-976b-f7b3f833030b","region":"EU"},{"organizationName":"MobiledgeX","appName":"andydocker2","version":"1","operatorName":"TDG","cloudletName":"verificationCloudlet","cloudletLocation":{"latitude":53.551085,"longitude":9.993682},"clusterdeveloper":"MobiledgeX","clusterName":"andydedicated","uri":"andydedicated.verificationcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":11,"public_port":11}],"flavorName":"automation_api_flavor","state":5,"powerState":3,"runtimeInfo":{"container_ids":["ubuntu_simap_1"]},"createdAt":{"seconds":1589401398,"nanos":308479061},"status":{},"uuid":"e47338fd-9f4e-4c9b-bd43-3c4d00293d5b","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"app1591856566-3881478","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"cluster1591856566-3881478","uri":"cluster1591856566-3881478.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2015,"public_port":2015},{"proto":2,"internal_port":2016,"public_port":2016}],"flavorName":"flavor1591856566-3881478","state":5,"powerState":3,"runtimeInfo":{"container_ids":["nginxapp1591856566-388147810","envoyapp1591856566-388147810","app1591856566-388147810"]},"createdAt":{"seconds":1591856630,"nanos":582169841},"status":{},"uuid":"c2d742cb-4445-470f-a1a6-9c74fd8f16a8","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"AppMetricsDocker1591802581-6760042docker","version":"2.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"MobiledgeX","clusterName":"cluster-1591802581-6760042-docker","uri":"cluster-1591802581-6760042-docker.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":2017,"public_port":2017},{"proto":2,"internal_port":2018,"public_port":2018}],"flavorName":"flavor1591802581-6760042","state":5,"powerState":3,"runtimeInfo":{"container_ids":["nginxappmetricsdocker1591802581-6760042docker20","envoyappmetricsdocker1591802581-6760042docker20","appmetricsdocker1591802581-6760042docker20","nginxappmetricsdocker1591802581-6760042docker10","envoyappmetricsdocker1591802581-6760042docker10","appmetricsdocker1591802581-6760042docker10"]},"createdAt":{"seconds":1591802713,"nanos":369983623},"status":{},"uuid":"4af0adf8-876c-4e51-ac40-41c30d81cf95","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"automationFrankfurtCloudlet","cloudletLocation":{"latitude":50.110922,"longitude":8.682127},"clusterdeveloper":"MobiledgeX","clusterName":"andyclusterhelm","uri":"andyclusterhelm.automationfrankfurtcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1590360804,"nanos":697743643},"status":{},"uuid":"489727f1-c752-46b8-b979-945c30bb69b1","region":"EU"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"testmonitor","clusterName":"k8ssampleapp","uri":"k8ssampleapp.automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060201","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591911726,"nanos":208477312},"status":{},"uuid":"c29d26f5-a0dc-48ed-b641-3b91bdc8a9a6","region":"EU"},{"organizationName":"testmonitor","appName":"iperf4","version":"v1","operatorName":"TDG","cloudletName":"andycloud","cloudletLocation":{"latitude":1,"longitude":1,"timestamp":{}},"clusterdeveloper":"testmonitor","clusterName":"autoclusterk8sangshu","uri":"andycloud.tdg.mobiledgex.net","liveness":"Static","flavorName":"automation_api_flavor","state":5,"powerState":3,"runtimeInfo":{"container_ids":["iperf-server-deployment-c7846cbcd-k7wpn"]},"createdAt":{"seconds":1591259822,"nanos":883214853},"status":{},"uuid":"e8fa56c5-2c74-4a9e-9165-0ef3dde7f371","region":"EU","revision":"0"},{"organizationName":"testmonitor","appName":"k8sapp","version":"v1","operatorName":"TDG","cloudletName":"automationDusseldorfCloudlet","cloudletLocation":{"latitude":51.2277,"longitude":6.7735},"clusterdeveloper":"testmonitor","clusterName":"k8ssampleapp","uri":"automationdusseldorfcloudlet.tdg.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":8080,"public_port":8080,"fqdn_prefix":"k8sapp-tcp."}],"flavorName":"automation_api_flavor","state":5,"powerState":3,"runtimeInfo":{"container_ids":["k8sapp-deployment-5fff4fbd9b-84fmx"]},"createdAt":{"seconds":1591912482,"nanos":263913793},"status":{},"uuid":"879a16e9-76ce-4cfe-9208-d3887b0877d7","region":"EU","revision":"0"},{"organizationName":"MobiledgeX","appName":"vmapp","version":"test","operatorName":"Packet","cloudletName":"QA","cloudletLocation":{"latitude":32.7767,"longitude":-96.797},"clusterdeveloper":"MobiledgeX","clusterName":"DefaultVMCluster","uri":"mobiledgexvmapptest.qa.packet.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":443,"public_port":443}],"flavorName":"m4.medium","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591143759,"nanos":96755126},"status":{},"uuid":"bd48d38f-410a-4daa-a0e6-6e716e9ff4e5","region":"US","revision":"0"},{"organizationName":"testmonitor","appName":"app-us","version":"v1","operatorName":"packet","cloudletName":"packetcloudlet","cloudletLocation":{"latitude":1,"longitude":1},"clusterdeveloper":"testmonitor","clusterName":"packetdocker","privacyPolicyName":"blockeverything","uri":"packetdocker.packetcloudlet.packet.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":8080,"public_port":8080}],"flavorName":"automation_api_flavor","revision":"2020-05-15T230653","state":5,"powerState":3,"runtimeInfo":{"container_ids":["envoyapp-usv1","app-usv1"]},"createdAt":{"seconds":1589584036,"nanos":982061947},"status":{},"uuid":"eeced5e9-2cc2-4baa-b435-e2932e8e397b","region":"US"},{"organizationName":"testmonitor","appName":"app-us-k8s","version":"v1","operatorName":"packet","cloudletName":"packetcloudlet","cloudletLocation":{"latitude":1,"longitude":1},"clusterdeveloper":"testmonitor","clusterName":"k8sdedicated","privacyPolicyName":"blockssh","uri":"k8sdedicated.packetcloudlet.packet.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":8080,"public_port":8080,"fqdn_prefix":"app-us-k8s-tcp."}],"flavorName":"automation_api_flavor","revision":"2020-05-15T220541","state":5,"powerState":3,"runtimeInfo":{"container_ids":["app-us-k8s-deployment-655c466b4-fkq2c"]},"createdAt":{"seconds":1589580392,"nanos":792312948},"status":{},"uuid":"a1056dde-0177-4aba-9176-1b0ecdb301d0","region":"US"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"tmus","cloudletName":"tmocloud-1","cloudletLocation":{"latitude":31,"longitude":-91},"clusterdeveloper":"MobiledgeX","clusterName":"autoclusterautomation","uri":"autoclusterautomation.tmocloud-1.tmus.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060022","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591854917,"nanos":189349728},"status":{},"uuid":"8d1461e6-d7a0-4e90-a288-6b8a5181caec","region":"US"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"packet","cloudletName":"packetcloudlet","cloudletLocation":{"latitude":1,"longitude":1},"clusterdeveloper":"testmonitor","clusterName":"k8sdedicated","uri":"k8sdedicated.packetcloudlet.packet.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060022","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1589580251,"nanos":423260679},"status":{},"uuid":"217c02c7-d337-4858-ad9b-08914d04da7d","region":"US"},{"organizationName":"MobiledgeX","appName":"MEXPrometheusAppName","version":"1.0","operatorName":"Packet","cloudletName":"QA","cloudletLocation":{"latitude":32.7767,"longitude":-96.797},"clusterdeveloper":"MobiledgeX","clusterName":"mexdemo-cluster","uri":"mexdemo-cluster.qa.packet.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":9090,"public_port":9090}],"flavorName":"x1.medium","revision":"2020-05-16T060022","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591042939,"nanos":480030180},"status":{},"uuid":"84d34879-5b37-44ba-a9f1-5e8b71349f43","region":"US"},{"organizationName":"MobiledgeX","appName":"automation_api_app","version":"1.0","operatorName":"tmus","cloudletName":"tmocloud-1","cloudletLocation":{"latitude":31,"longitude":-91},"clusterdeveloper":"MobiledgeX","clusterName":"autoclusterautomation","uri":"tmocloud-1.tmus.mobiledgex.net","liveness":"Static","mappedPorts":[{"proto":1,"internal_port":1234,"public_port":1234,"fqdn_prefix":"automation-api-app-tcp."}],"flavorName":"automation_api_flavor","revision":"2020-05-19T210428","state":5,"powerState":3,"runtimeInfo":{},"createdAt":{"seconds":1591854917,"nanos":88768873},"status":{},"uuid":"96b8b4d0-cecf-474e-b176-bda4df632ad4","region":"US"}]
*/