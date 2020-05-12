import * as serviceMC from "../../../../services/model/serviceMC";
import * as serverData from "../../../../services/model/serverData";
import * as Cloudlet from "./model/cloudlet";
import * as Appinst from "./model/appinst";
import * as Events from "./model/events";

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
                name: info.cloudletSelectedOne
            },
            last: info.last
        };
    } else if (info.method === serviceMC.getEP().METRICS_CLOUDLET) {
        return {
            token: token,
            params: {
                region: info.pRegion,
                cloudlet: {
                    organization: info.selectOrg,
                    name: info.cloudletSelectedOne
                },
                last: 1,
                selector: "*"
            }
        };
    }
};

/***********************************
 * LIST CLOUDLET
 ************************************/
const getListCloud = (self, params) => {
    /* First, need to get data for all cloudltes */
    Cloudlet.getCloudletList(self, params);
    /* Through the result to the ContainerWrapper.onLoadComplete after success execute getCloudletList */
};
/***********************************
 * LIST APPINSTANCE
 ************************************/
const getListAppinst = async (self, params) => {
    /* First, need to get data for all appinstance */
    return await Appinst.getAppinstanceList(self, params)
};


/***********************************
 * METRICS CLOUDLET
 ************************************/
let store = JSON.parse(localStorage.PROJECT_INIT);
let token = store ? store.userToken : "null";
const getMetricsCloudlet = async (self, params) => {
    /* Continue, get events of cloudlets */
    const requestData = cloudletInfo => {
        return {
            token: token,
            pRegion: cloudletInfo.region,
            selectOrg: cloudletInfo.operatorName,
            method: serviceMC.getEP().METRICS_CLOUDLET,
            cloudletSelectedOne: cloudletInfo.cloudletName,
            last: 10
        }
    };

    params.cloudlets.map(async (cloudlet, i) => {
        let response = await Cloudlet.getCloudletMetrics(
            self,
            requestData(cloudlet)
        );
        self.onReceiveResult(response, self)
    });
};

/***********************************
 * EVENT CLOUDLET
 ************************************/
const getEventCloudlet = async (self, params) => {
    /* Continue, get events of cloudlets */

    const execrequest = cloudletInfo =>
        getArgs({
            pRegion: cloudletInfo.region,
            selectOrg: cloudletInfo.operatorName,
            method: serviceMC.getEP().EVENT_CLOUDLET,
            cloudletSelectedOne: cloudletInfo.cloudletName,
            last: 1
        });

    let store = JSON.parse(localStorage.PROJECT_INIT);
    let token = store ? store.userToken : "null";
    const requestData = cloudlet => {
        return {
            token: token,
            method: serviceMC.getEP().EVENT_CLOUDLET,
            data: execrequest(cloudlet)
        };
    };

    return Promise.all(
        params.cloudlets.map(async (cloudlet, i) => {
            return Events.getCloudletEvent(
                self,
                requestData(cloudlet),
                params.chartType
            );
        })
    );
};

/***********************************
 * METRICS CLIENT
 * {
  "region": "local",
  "appinst": {
    "app_key": {
      "organization": "AcmeAppCo",
      "name": "someapplication1",
      "version": "1.0"
    }
  },
  "method": "FindCloudlet",
  "selector": "api",
  "last": 1
}
* 1. 모든 앱 리스트 가져오기
* 2. 지역과 조직과 앱의 정보와 메소드를 통하여 클라이언트의 정보를 가져오면 
* 3. 
 ************************************/
const getMethodClient = (self, params) => {
    let execrequest = getArgs({
        region: "EU",
        appinst: {
            app_key: {
                organization: "VenkyDev",
                name: "GithubDeploy",
                version: "1.0"
            }
        },
        method: "FindCloudlet",
        selector: "api",
        last: 1
    });

    let requestData = {
        token: token,
        method: serviceMC.getEP().METHOD_CLIENT,
        data: execrequest
    };

    return requestData;
};

let cloudletList = [];
const MetricsService = async (defaultValue: MetricsParmaType, self: any) => {
    if (defaultValue.method === serviceMC.getEP().SHOW_CLOUDLET) {
        return await getListCloud(self, defaultValue);
    } else if (defaultValue.method === serviceMC.getEP().SHOW_APP_INST) {
        return await getListAppinst(self, defaultValue);
    }
    if (defaultValue.method === serviceMC.getEP().EVENT_CLOUDLET) {
        //this.props.handleLoadingSpinner(true);
        getEventCloudlet(defaultValue.self, defaultValue).then(async data => {
            self.onReceiveResult(data, self);
        });
    }
    if (defaultValue.method === serviceMC.getEP().METRICS_CLOUDLET) {
        let result = await getMetricsCloudlet(self, defaultValue);
    }

    if (defaultValue.method === serviceMC.getEP().METRICS_CLIENT) {
        return await serviceMC.sendSyncRequest(
            self,
            getMethodClient(defaultValue.self, defaultValue)
        );
    }
};

export default MetricsService;
//export const EventsCloudlet;



/*
{
  "region": "US",
  "appinst": {
    "app_key": {
      "organization": "MobiledgeX",
      "name": "automation_api_app",
      "version": "1.0"
    },
    "cluster_inst_key": {
      "cluster_key": {
        "name": "autoclusterautomation"
      },
      "cloudlet_key": {
        "name": "tmocloud-1",
        "organization": "tmus"
      }
    }
  },
  "selector": "*",
  "last": 10,
  "starttime": "2019-05-08T11:50:00Z",
  "endtime": "2020-05-06T11:50:00Z"
}
*/