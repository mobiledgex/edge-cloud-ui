/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-useless-catch */
/* eslint-disable indent */
import React from "react";
import sizeMe from "react-sizeme";
import { connect } from "react-redux";
import MonitoringLayout from "./layout/layout";
import * as actions from "../../../actions";
//
import * as Service from "./services";
import * as serviceMC from "../../../services/model/serviceMC";
import * as chartType from "./formatter/chartType";
import * as dataType from "./formatter/dataType";
import HeaderFiltering from "./hooks/HeaderFiltering";

// doCloudlets = true    데이터 로딩을 잠시 멈춤 : UI 작업을 위하여
let doCloudlets = false;
let count = 0;
let countApp = 0;
let countCluster = 0;
let regionCount = 0;
let scope = null;
const authDepths = ["summary", "cloudlets", "clusters", "appinsts"];
const regions = localStorage && localStorage.regions ? localStorage.regions.split(",") : [];

class MonitoringAdmin extends React.Component {
    constructor() {
        super();
        scope = this;
        this.state = {
            currentBreakpoint: "lg",
            compactType: "vertical",
            mounted: false,
            layouts: { lg: [] },
            toolbox: { lg: [] },
            compCloudlet: [],
            compClusterinst: [],
            compAppinst: [],
            filteringItems: {},
            currentAuthDepth: 0// <<<===== change depth
        };
        this.hasCloudlets = [];
        this.hasCluster = [];
        this.hasAppinst = [];
    }

    componentDidMount() {
        this.setState({
            currentBreakpoint: "lg",
            compactType: "vertical",
            mounted: true,
            layouts: { lg: this.props.initialLayout },
            toolbox: { lg: [] },
        });
        /**
         * Necessary list of cloudlet to request metrics info
         */
        if (this.hasCloudlets.length === 0 && !doCloudlets) {
            doCloudlets = true;
            regionCount = regions.length;
            count = regions.length;
            countApp = regions.length;
            countCluster = regions.length;
            /**
             * NEED FOR LIST OF CLOUDLET
             * get data all of the cloudlets to get metrics data
             * */
            this.initialize(
                {
                    method: serviceMC.getEP().SHOW_CLOUDLET,
                    regions,
                },
                this,
            );
            /**
             * NEED FOR LIST OF CLUSTERINSTANCE
             * get data all of the clusterinstance
             * */
            this.initialize(
                {
                    method: serviceMC.getEP().SHOW_CLUSTER_INST,
                    regions,
                },
                this,
            );
            /**
             * NEED FOR LIST OF APPINSTANCE
             * get data all of the appinstance
             * */
            this.initialize(
                {
                    method: serviceMC.getEP().SHOW_APP_INST,
                    regions,
                },
                this,
            );
        }
    }

    componentDidUpdate(prevProps) {
        console.log("20200605 did update == ", prevProps, ":autho depth = ", this.state.currentAuthDepth);
    }


    onReceiveResult(result) {
        try {
            if (result && result.Cloudlets) {
                this.hasCloudlets = this.hasCloudlets.concat(result.Cloudlets);
                count--;
            } else if (result && result.AppinstList) {
                this.hasAppinst = this.hasAppinst.concat(result.AppinstList);
                countApp--;
            } else if (result && result.Clusterinst) {
                countCluster = 0;
            } else {
                return;
            }

            if (count <= 0 && result.Cloudlets) {
                this.setState({
                    compCloudlet: this.hasCloudlets,
                });
                count = regionCount;
            } else if (countApp <= 0 && result.AppinstList) {
                this.setState({
                    compAppinst: this.hasAppinst,
                });
                countApp = regionCount;
            } else if (countCluster <= 0 && result.Clusterinst) {
                this.setState({
                    compClusterinst: result.Clusterinst,
                });
            }
        } catch (e) {
            throw e;
        }
    }

    initialize = async (props: any, self: any) => {
        try {
            /**  As result call method which << this.onReceiveResult >> */
            if (props.method === serviceMC.getEP().SHOW_APP_INST) {
                const resultMetrics = await Service.getPrepareList(props, self);
                if (resultMetrics && resultMetrics[0].AppinstList) {
                    resultMetrics.map(mtr => {
                        self.onReceiveResult(mtr);
                    });
                }
            } else if (props.method === serviceMC.getEP().SHOW_CLOUDLET) {
                await Service.getPrepareList(props, self);
            } else if (props.method === serviceMC.getEP().SHOW_CLUSTER_INST) {
                const resultClusters = await Service.getPrepareList(props, self);
                if (resultClusters) {
                    const newObject = { Clusterinst: {} };
                    let newArray = [];
                    resultClusters.map(cluster => {
                        newArray = newArray.concat(cluster);
                    });
                    newObject.Clusterinst = newArray;
                    self.onReceiveResult(newObject);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    /*
    * filter item length
    length = 0 : Data is filtered by the selected region
    length = 1 : go to page of the cloudlets / currentAuthDepth = 0
    length = 2 : go to page of the clusterinstances / currentAuthDepth = 1
    length = 3 : go to page of the appinstances / currentAuthDepth = 2
    */
    onHandleApplyFilter = filteredItem => {
        console.log("20200605 filtering == ", filteredItem);
        /* example
        {region: {depth:0 , value:"EU"}}
        */
        const filteredDepth = Object.keys(filteredItem).length;


        // 잠시 막음
        this.setState({ currentAuthDepth: filteredDepth, filteringItems: filteredItem });
        this.forceUpdate();
    }

    getCurrentItem = (depth, scope, props, compCloudlet, compClusterinst, compAppinst) => {
        // TODO : 20200606 should have filtering compCloudlet & compClusterinst, comAppinst
        let currentItm = null;
        switch (depth) {
            case 0: currentItm = generateComponentAdmin(scope, props, compCloudlet, compClusterinst, compAppinst); break;
            case 1: currentItm = generateComponentOperator(scope, props, compCloudlet, compClusterinst, compAppinst); break;
            case 2: currentItm = generateComponentDeveloper(scope, props, compCloudlet, compClusterinst, compAppinst); break;
            default: currentItm;
        }
        return currentItm;
    }

    render() {
        const scope = this;
        const containerWidth = this.props.size.width;
        const containerHeight = this.props.size.height;
        const {
            compCloudlet, compClusterinst, compAppinst, currentAuthDepth
        } = this.state;
        console.log("20200605 render =", currentAuthDepth);
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%"
                }}
            >
                <HeaderFiltering
                    title="MONITORING"
                    compCloudlet={compCloudlet}
                    compClusterinst={compClusterinst}
                    compAppinst={compAppinst}
                    regions={regions}
                    selectedRegion="All"
                    onHandleApplyFilter={this.onHandleApplyFilter}
                />
                <MonitoringLayout
                    initialLayout={generateLayout(this.props)}
                    sizeInfo={this.props.size}
                    items={this.getCurrentItem(currentAuthDepth, scope, this.props, compCloudlet, compClusterinst, compAppinst)}
                />
            </div>
        );
    }
}

/**
 * You can get layout value in here..  try it.
 * https://strml.github.io/react-grid-layout/examples/6-dynamic-add-remove.html
 * Displayed as [x, y, w, h]:
 */
const headerTitle = ["Title1", "Title2", "Title3", "Title4", "Title5", "Title6"];
const itemX = [0, 0, 3, 3 + 6, 3 + 6, 0];
const itemY = [0, 2, 0, 0, 2, 4];
const itemWidth = [3, 3, 6, 3, 3, 12];
const itemHeight = [1, 1, 2, 1, 1, 1]; // impact from setting rowHeight for grid layout props
const raw = 3;

const generateLayout = size => headerTitle.map((title, i) => ({
    x: itemX[i],
    y: itemY[i],
    w: itemWidth[i],
    h: itemHeight[i],
    i: title,
    idx: i,
    static: false,
    isDraggable: true,
}));
const mapStateToProps = state => {
    const regionInfo = state.regionInfo ? state.regionInfo : null;
    return {
        regionInfo,
    };
};
const mapDispatchProps = dispatch => ({
    handleAlertInfo: (mode, msg) => {
        dispatch(actions.alertInfo(mode, msg));
    },
    // handleLoadingSpinner: (data) => {
    //     dispatch(actions.loadingSpinner(data));
    // },
    onLoadComplete: data => {
        scope.onReceiveResult(data);
    },
});
export default connect(
    mapStateToProps,
    mapDispatchProps,
)(sizeMe({ monitorHeight: true, refreshMode: "debounce" })(MonitoringAdmin));


/**
* TODO : // should make JSON property
* */
//  second page -- 0
const generateComponentAdmin = (self, infos, cloudlets, appinsts, clusters) => {
    const defaultProp = {
        sizeInfo: infos.size,
        self,
        cloudlets,
        appinsts,
        clusters,
        ...self.state.filteringItems
    };
    return [
        {
            id: dataType.COUNT_CLUSTER,
            method: serviceMC.getEP().COUNT_CLUSTER,
            chartType: chartType.COUNTER,
            type: "counter",
            title: { value: "Count of Clusters", align: "left" },
            filter: null,
            page: "multi",
            itemCount: 3,
            legend: false,
            ...defaultProp,
        },
        {
            id: dataType.NETWORK_CLOUDLET,
            method: serviceMC.getEP().METRICS_CLOUDLET,
            chartType: chartType.GRAPH,
            type: "scatter",
            title: { value: "Health of Cloudlets", align: "left" },
            filter: { type: "dropdown", method: serviceMC.getEP().METRICS_CLOUDLET },
            page: "multi",
            itemCount: 3,
            legend: true,
            ...defaultProp,
        },
        {
            id: dataType.FIND_CLOUDLET,
            method: serviceMC.getEP().METRICS_CLIENT,
            chartType: chartType.MAP,
            type: "scatter",
            title: { value: "Find Cloudlets", align: "left" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
        {
            id: dataType.REGISTER_CLIENT,
            // method: serviceMC.getEP().METRICS_CLIENT,
            method: null,
            chartType: chartType.GRAPH,
            type: "scatter",
            title: { value: "Rate of Register Client", align: "left" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
        {
            id: dataType.FIND_CLOUDLET,
            // method: serviceMC.getEP().METRICS_CLIENT,
            method: null,
            chartType: chartType.GRAPH,
            type: "bar",
            title: { value: "Count of Find Cloudlet", align: "left" },
            filter: null,
            page: "single",
            legend: true,
            calculate: "summ",
            ...defaultProp,
        },
        {
            id: dataType.METHOD_CLIENT,
            method: serviceMC.getEP().METRICS_CLIENT,
            chartType: chartType.TABLE,
            type: "alarm",
            title: { value: "Metrics of Clients", align: "center" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
    ];
};
//  second page -- 1
const generateComponentOperator = (self, infos, cloudlets, appinsts, clusters) => {
    const defaultProp = {
        sizeInfo: infos.size,
        self,
        cloudlets,
        appinsts,
        clusters
    };
    return [
        {
            id: dataType.NETWORK_CLOUDLET,
            method: serviceMC.getEP().METRICS_CLOUDLET,
            chartType: chartType.GAUGE,
            type: "scatter",
            title: { value: "Health of Cloudlets", align: "left" },
            filter: null,
            page: "single",
            itemCount: 3,
            legend: false,
            ...defaultProp,
        },
        {
            id: dataType.NETWORK_CLOUDLET,
            method: null,
            chartType: chartType.GRAPH,
            type: "scatter",
            title: { value: "Health of Cloudlets", align: "left" },
            filter: { type: "dropdown", method: serviceMC.getEP().METRICS_CLOUDLET },
            page: "single",
            itemCount: 3,
            legend: false,
            ...defaultProp,
        },
        {
            id: dataType.FIND_CLOUDLET,
            method: null,
            chartType: chartType.MAP,
            type: "scatter",
            title: { value: "Find Cloudlets", align: "left" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
        {
            id: dataType.METHOD_CLIENT,
            method: serviceMC.getEP().METRICS_CLIENT,
            chartType: chartType.COUNTERWITHSPARK,
            type: "scatter",
            title: { value: "Rate of Register Client", align: "left" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
        {
            id: dataType.FIND_CLOUDLET,
            method: null,
            chartType: chartType.GRAPH,
            type: "bar",
            title: { value: "Count of Find Cloudlet", align: "left" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
        {
            id: dataType.EVENT_CLOUDLET,
            method: serviceMC.getEP().EVENT_CLOUDLET,
            chartType: chartType.TABLE,
            type: "alarm",
            title: { value: "Events of Cloudlet", align: "center" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
    ];
};
// third page -- 2
const generateComponentDeveloper = (self, infos, cloudlets, appinsts, clusters) => {
    const defaultProp = {
        sizeInfo: infos.size,
        self,
        cloudlets,
        appinsts,
        clusters
    };
    return [
        {
            id: dataType.COUNT_CLUSTER,
            method: serviceMC.getEP().COUNT_CLUSTER,
            chartType: chartType.COUNTER,
            type: "counter",
            title: { value: "Health of Clusters", align: "left" },
            filter: null,
            page: "multi",
            itemCount: 3,
            legend: false,
            ...defaultProp,
        },
        {
            id: dataType.NETWORK_CLOUDLET,
            method: serviceMC.getEP().METRICS_CLOUDLET,
            chartType: chartType.GRAPH,
            type: "scatter",
            title: { value: "Connections of Cluster", align: "left" },
            filter: { type: "dropdown", method: serviceMC.getEP().METRICS_CLOUDLET },
            page: "single",
            itemCount: 3,
            legend: false,
            ...defaultProp,
        },
        {
            id: dataType.FIND_CLOUDLET,
            method: serviceMC.getEP().METRICS_CLIENT,
            chartType: chartType.MAP,
            type: "scatter",
            title: { value: "Structure of cluster", align: "left" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
        {
            id: dataType.NODE_INFO,
            method: null,
            chartType: chartType.BUBBLECHART,
            type: "scatter",
            title: { value: "Infomation of node", align: "left" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
        {
            id: dataType.FIND_CLOUDLET,
            method: serviceMC.getEP().METRICS_CLIENT,
            chartType: chartType.GRAPH,
            type: "bar",
            title: { value: "Type of Cluster", align: "left" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
        {
            id: dataType.EVENT_CLUSTER,
            method: serviceMC.getEP().EVENT_CLUSTER,
            chartType: chartType.TABLE,
            type: "alarm",
            title: { value: "Events of Cluster", align: "center" },
            filter: null,
            page: "single",
            legend: true,
            ...defaultProp,
        },
    ];
};
