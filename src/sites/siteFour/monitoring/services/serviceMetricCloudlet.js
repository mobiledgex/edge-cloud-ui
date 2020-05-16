import * as serviceMC from "../../../../services/model/serviceMC";

const setRemote = result => { };
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
// EventsCloudlet = (defaultValue: any) => {
//     let execrequest = getArgs();

//     let requestedData = {
//         execrequest: execrequest,
//         region: "EU"
//     };

//     let store = JSON.parse(localStorage.PROJECT_INIT);
//     let token = store ? store.userToken : "null";
//     let requestData = {
//         token: token,
//         method: serviceMC.getEP().EVENT_CLOUDLET,
//         data: requestedData
//     };
//     this.props.handleLoadingSpinner(true);
//     serviceMC.sendWSRequest(requestData, setRemote);
//     return { result: "good" };
// };
const MetricsCloudlet = (defaultValue: any) => {
    const _self = this;
    if (defaultValue === "table") {
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
        //this.props.handleLoadingSpinner(true);
        return serviceMC.sendSyncRequest(_self, requestData);
    }
};

export default MetricsCloudlet;
//export const EventsCloudlet;
