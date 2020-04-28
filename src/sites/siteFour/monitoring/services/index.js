import * as serviceMC from "../../../../services/model/serviceMC";
import * as serverData from "../../../../services/model/serverData";
import * as Cloudlet from "./model/cloudlet";

interface MetricsParmaType {
    id: string;
    method: string | null;
    chartType: string;
    type: string;
    sizeInfo: Object;
    self: any;
}

const setRemote = result => {
    console.log("20200414 result of remote --- ", result);
};
const getArgs = info => {
    return {
        region: info.pRegion,
        cloudlet: {
            organization: info.selectOrg,
            name: info.cloudletSelectedOne
        },
        last: info.last
    };
};
/***********************************
 * LIST CLOUDLET
 ************************************/
const getListCloud = (params, self) => {
    /* First, need to get data for all cloudltes */
    Cloudlet.getCloudletList(params, self);
    /* Through the result to the ContainerWrapper.onLoadComplete after success execute getCloudletList */
};

/***********************************
 * EVENT CLOUDLET
 ************************************/
const getEventCloudlet = (_self, cloudletInfo) => {
    console.log("get event cloudlet info -->>>> ", cloudletInfo);
    /* Continue, get events of cloudlets */
    let execrequest = getArgs({
        pRegion: cloudletInfo.cloudlet.region,
        selectOrg: cloudletInfo.cloudlet.org,
        cloudletSelectedOne: cloudletInfo.cloudlet.name,
        last: 1
    });

    let store = JSON.parse(localStorage.PROJECT_INIT);
    let token = store ? store.userToken : "null";
    let requestData = {
        token: token,
        method: serviceMC.getEP().EVENT_CLOUDLET,
        data: execrequest
    };

    return requestData;
};

let cloudletList = [];
const MetricsService = async (defaultValue: MetricsParmaType, self: any) => {
    console.log("20200427 metric service ... ", defaultValue.method);
    if (defaultValue.method === serviceMC.getEP().SHOW_CLOUDLET) {
        getListCloud(defaultValue, self);
    }
    if (defaultValue.method === serviceMC.getEP().EVENT_CLOUDLET) {
        //this.props.handleLoadingSpinner(true);
        return await serviceMC.sendSyncRequest(
            self,
            getEventCloudlet(defaultValue.self, defaultValue.cloudletInfo)
        );
    }
};

export default MetricsService;
//export const EventsCloudlet;
