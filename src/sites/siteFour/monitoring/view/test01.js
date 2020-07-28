import {
    fetchAppInstList,
    fetchCloudletList,
    fetchClusterList,
    getAllAppInstEventLogs,
    getAppInstLevelUsageList,
    requestShowAppInstClientWS
} from "../service/PageMonitoringMetricService";
import {APP_INST_MATRIX_HW_USAGE_INDEX, CLASSIFICATION} from "../../../../shared/Constants";
import type {TypeAppInst, TypeCloudlet} from "../../../../shared/Types";
import {getCloudletClusterNameList, makeDropdownForAppInst, makeMapMarkerObjectForDev, makeRegionCloudletClusterTreeDropdown} from "../service/PageMonitoringService";
import {getOneYearStartEndDatetime} from "../service/PageMonitoringCommonService";

handleClickInAppInstMenuForDev = async (fullAppInstJson) => {
    try {
        await this.setState({showAppInstClient: false,})
        let currentCloudletName = fullAppInstJson.split(" | ")[1].trim();
        clearInterval(this.intervalForAppInst)
        clearInterval(this.intervalForCluster)
        //@desc: ################################
        //@desc: requestShowAppInstClientWS
        //@desc: ################################
        if (this.state.showAppInstClient) {
            await this.setState({
                selectedClientLocationListOnAppInst: [],
            })
            this.webSocketInst = requestShowAppInstClientWS(fullAppInstJson, this);
        }

        await this.setState({
            currentAppInst: fullAppInstJson,
            loading: true,
            currentClassification: CLASSIFICATION.APPINST,
        })

        let AppName = fullAppInstJson.split('|')[0].trim()
        let Cloudlet = fullAppInstJson.split('|')[1].trim()
        let ClusterInst = fullAppInstJson.split('|')[2].trim()
        let Version = fullAppInstJson.split('|')[3].trim()
        let promiseList = []
        promiseList.push(fetchCloudletList())
        promiseList.push(fetchClusterList())
        promiseList.push(fetchAppInstList(undefined, this))
        promiseList.push(getAllAppInstEventLogs());
        const [promiseCloudletList, promiseClusterList, promiseAppInstList, promiseAppInstEventLogs] = await Promise.all(promiseList);
        let allCoudletList = promiseCloudletList;
        let allClusterList = promiseClusterList;
        let allAppInstList = promiseAppInstList;
        let allAppInstEventLogs = promiseAppInstEventLogs
        let filteredAppInstList = allAppInstList.filter((item: TypeAppInst, index) => {
            return item.AppName === AppName && item.Version === Version && item.Cloudlet == Cloudlet && item.ClusterInst == ClusterInst
        })

        let filteredCloudletList = allCoudletList.filter((item: TypeCloudlet, index) => {
            return item.CloudletName === currentCloudletName
        })

        //desc: ############################
        //desc: filtered AppInstEventLogList
        //desc: ############################
        let filteredAppInstEventLogList = allAppInstEventLogs.filter(item => {
            if (item[APP_INST_MATRIX_HW_USAGE_INDEX.APP].trim() === AppName && item[APP_INST_MATRIX_HW_USAGE_INDEX.CLUSTER].trim() === ClusterInst) {
                return true;
            }
        })


        //todo : ###############
        //todo : map marker
        //todo : ###############
        let orgAppInstList = filteredAppInstList.filter((item: TypeAppInst, index) => item.OrganizationName === localStorage.getItem('selectOrg'))
        let markerMapObjectForMap = makeMapMarkerObjectForDev(orgAppInstList, filteredCloudletList)
        await this.setState({
            markerList: markerMapObjectForMap,
            mapLoading: false,
        })


        let appInstDropdown = makeDropdownForAppInst(filteredAppInstList)
        let arrDateTime = getOneYearStartEndDatetime();
        let appInstUsageList = await getAppInstLevelUsageList(filteredAppInstList, "*", this.state.dataLimitCount, arrDateTime[0], arrDateTime[1]);
        fullAppInstJson = fullAppInstJson.trim().split("|")[0].trim() + " | " + fullAppInstJson.split('|')[1].trim() + " | " + fullAppInstJson.split('|')[2].trim() + ' | ' + Version

        //todo : ###############
        //todo : clusterDropdown
        //todo : ###############
        let regionList = localStorage.getItem('regions').split(",")
        let cloudletClusterListMap = getCloudletClusterNameList(allClusterList)
        let clusterTreeDropdownList = makeRegionCloudletClusterTreeDropdown(regionList, cloudletClusterListMap.cloudletNameList, allClusterList, this, true)

        //todo : ###############
        //todo : Terminal
        //todo : ###############
        this.validateTerminal(filteredAppInstList)

        await this.setState({
            filteredAppInstEventLogList: filteredAppInstEventLogList,
            clusterTreeDropdownList: clusterTreeDropdownList,
            currentAppVersion: Version,
            terminalData: null,
            appInstDropdown: appInstDropdown,
            currentTabIndex: 0,
            allAppInstUsageList: appInstUsageList,
            appInstList: allAppInstList,////todo
            filteredAppInstUsageList: appInstUsageList,
            loading: false,
            currentAppInstNameVersion: AppName + ' [' + Version + ']',
            currentAppInst: fullAppInstJson,
            allClusterList: allClusterList,
            filteredClusterList: allClusterList,
            clusterSelectBoxPlaceholder: 'Select Cluster',
        });

        //desc: ############################
        //desc: setStream
        //desc: ############################
        if (this.state.isStream) {
            this.setAppInstInterval(filteredAppInstList)
        } else {
            clearInterval(this.intervalForAppInst)
        }

    } catch (e) {
        //throw new Error(e)
    }
}