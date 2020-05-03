import * as serviceMC from "../../../../services/model/serviceMC";
import * as serverData from "../../../../services/model/serverData";
import * as Cloudlet from "./model/cloudlet";
import * as Events from "./model/events";

interface MetricsParmaType {
    id: string;
    method: string | null;
    chartType: string;
    type: string;
    sizeInfo: Object;
    self: any;
}

const setRemote = result => {};
const getArgs = info => {
    if (info.method) {
    }
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
const getListCloud = (self, params) => {
    /* First, need to get data for all cloudltes */
    Cloudlet.getCloudletList(self, params);
    /* Through the result to the ContainerWrapper.onLoadComplete after success execute getCloudletList */
};

/***********************************
 * EVENT CLOUDLET
 * 
 * async function showMessages() {
  // RIGHT :: Array.map using async-await and Promise.all
  const messages = await Promise.all(
    arr.map(user => {
      return getIntroMessage(user);
    })
  );
  console.log(messages);
}
showMessages();



cloudletName:"hackathon-jimmorris"
cloudletStatus:4
containerVersion:"2020-04-20"
ipSupport:"Dynamic"
latitude:33.0151
longitude:-96.5389
numDynamicIPs:254
operatorName:"mex"
physicalName:"hackathon-jimmorris"
platformType:"Edgebox"
region:"US"
 ************************************/
const getEventCloudlet = async (self, params) => {
    console.log("get event cloudlet info -->>>> ", params);
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

    // serviceMC.sendSyncRequest(self, requestData);

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
 * METHOD CLIENT
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

    let store = JSON.parse(localStorage.PROJECT_INIT);
    let token = store ? store.userToken : "null";
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
    }
    if (defaultValue.method === serviceMC.getEP().EVENT_CLOUDLET) {
        //this.props.handleLoadingSpinner(true);
        getEventCloudlet(defaultValue.self, defaultValue).then(async data => {
            self.onReceiveResult(data);
        });
    }
    // if (defaultValue.method === serviceMC.getEP().METHOD_CLIENT) {
    //     return await serviceMC.sendSyncRequest(
    //         self,
    //         getMethodClient(defaultValue.self, defaultValue)
    //     );
    // }
};

export default MetricsService;
//export const EventsCloudlet;
