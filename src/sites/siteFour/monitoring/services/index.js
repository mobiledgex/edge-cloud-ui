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
    // First, need to get data for all cloudltes
    let resultCloudlet = Cloudlet.getCloudletList(params, self);
};

/***********************************
 * EVENT CLOUDLET
 ************************************/
const getEventCloudlet = async _self => {
    ////// Continue, get events of cloudlets
    let execrequest = getArgs({
        pRegion: "EU",
        selectOrg: "TDG",
        cloudletSelectedOne: "berlin-test",
        last: 100
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
    let resultCloudlet = await getListCloud(defaultValue, self);
    console.log(
        "20200424 metric service ... ",
        defaultValue.method,
        ":",
        resultCloudlet
    );
    if (
        defaultValue.method === serviceMC.getEP().EVENT_CLOUDLET &&
        resultCloudlet
    ) {
        //this.props.handleLoadingSpinner(true);
        return serviceMC.sendSyncRequest(
            self,
            getEventCloudlet(defaultValue.self)
        );
    }
};

export default MetricsService;
//export const EventsCloudlet;
