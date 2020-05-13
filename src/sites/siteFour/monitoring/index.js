/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-useless-catch */
/* eslint-disable indent */
import React from "react";
import _ from "lodash";
import sizeMe from "react-sizeme";
import { connect } from "react-redux";
import MonitoringLayout from "./layout/layout";
import * as actions from "../../../actions";
//
import * as Service from "./services";
import ChartWidget from "./container/ChartWidget";
import * as serviceMC from "../../../services/model/serviceMC";
import * as ChartType from "./formatter/chartType";

let doCloudlets = null;
let count = 0;
let countApp = 0;
let regionCount = 0;
let scope = null;
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
            compAppinst: [],
        };
        this.hasCloudlets = [];
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
        const regions = localStorage.regions.split(",");
        if (this.hasCloudlets.length === 0 && !doCloudlets) {
            doCloudlets = true;
            regionCount = regions.length;
            count = regions.length;
            countApp = regions.length;
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

    componentWillReceiveProps(nextProps) { }

    onReceiveResult(result) {
        try {
            if (result && result.Cloudlets) {
                this.hasCloudlets = this.hasCloudlets.concat(result.Cloudlets);
                count--;
            } else if (result && result.AppinstList) {
                this.hasAppinst = this.hasAppinst.concat(result.AppinstList);
                countApp--;
            } else {
                return;
            }

            if (count <= 0) {
                this.setState({
                    compCloudlet: this.hasCloudlets,
                });
                count = regionCount;
            } else if (countApp <= 0) {
                console.log("20200513 init appinst .... ", this.hasAppinst);
                this.setState({
                    compAppinst: this.hasAppinst,
                });
                countApp = regionCount;
            }
        } catch (e) {
            throw e;
        }
    }

    async initialize(props: any, self: any) {
        try {
            /**  As result call method which << this.onReceiveResult >> */
            if (props.method === serviceMC.getEP().SHOW_APP_INST) {
                const resultMetrics = await Service.getPrepareList(props, self);
                if (resultMetrics && resultMetrics[0].AppinstList) {
                    count = resultMetrics.length;
                    resultMetrics.map((mtr) => {
                        this.onReceiveResult(mtr);
                    });
                }
                console.log("20200513 init result of init ---- ", resultMetrics);
            } else if (props.method === serviceMC.getEP().SHOW_CLOUDLET) {
                console.log("20200513 init show cloudlet  ---- ");
                await Service.getPrepareList(props, self);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const scope = this;
        const containerWidth = this.props.size.width;
        const containerHeight = this.props.size.height;
        const { compCloudlet, compAppinst } = this.state;
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#ababab",
                }}
            >
                <div>{containerWidth}</div>
                <div>{containerHeight}</div>
                <MonitoringLayout
                    initialLayout={generateLayout(this.props)}
                    sizeInfo={this.props.size}
                    items={generateComponentAdmin(
                        scope,
                        this.props,
                        compCloudlet,
                        compAppinst,
                    )}
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

const generateLayout = (size) => headerTitle.map((title, i) => ({
    x: itemX[i],
    y: itemY[i],
    w: itemWidth[i],
    h: itemHeight[i],
    i: title,
    idx: i,
    static: false,
    isDraggable: true,
}));
const mapStateToProps = (state) => {
    const regionInfo = state.regionInfo ? state.regionInfo : null;
    return {
        regionInfo,
    };
};
const mapDispatchProps = (dispatch) => ({
    handleAlertInfo: (mode, msg) => {
        dispatch(actions.alertInfo(mode, msg));
    },
    handleLoadingSpinner: (data) => {
        dispatch(actions.loadingSpinner(data));
    },
    onLoadComplete: (data) => {
        scope.onReceiveResult(data);
    },
});
export default connect(
    mapStateToProps,
    mapDispatchProps,
)(sizeMe({ monitorHeight: true, refreshMode: "debounce" })(MonitoringAdmin));

const makeFilterComponent = (info) => {

};
const generatWidget = (info) => (
    <ChartWidget
        id={info.id}
        title={info.title}
        filter={info.filter}
        method={info.method}
        chartType={info.chartType}
        type={info.type}
        size={info.sizeInfo}
        cloudlets={info.cloudlets}
        appinsts={info.appinsts}
        page={info.page}
        itemCount={info.itemCount}
    />
);
const generateComponentAdmin = (self, infos, cloudlets, appinsts) => {
    const defaultProp = {
        sizeInfo: infos.size,
        self,
        cloudlets,
        appinsts,
    };
    return [
        generatWidget({
            id: "countCluster",
            method: null,
            chartType: ChartType.COUNTER,
            type: "",
            title: { value: "Count of Clusters", align: "left" },
            filter: null,
            page: "multi",
            itemCount: 3,
            ...defaultProp,
        }),
        generatWidget({
            id: "networkCloudlet",
            method: serviceMC.getEP().METRICS_CLOUDLET,
            chartType: ChartType.GRAPH,
            type: "scatter",
            title: { value: "Health of Cloudlets", align: "left" },
            filter: { type: "dropdown", method: serviceMC.getEP().METRICS_CLOUDLET },
            page: "multi",
            itemCount: 3,
            ...defaultProp,
        }),
        generatWidget({
            id: "findCloudlet",
            method: serviceMC.getEP().METRICS_CLIENT,
            chartType: ChartType.MAP,
            type: "scatter",
            title: { value: "Find Cloudlets", align: "left" },
            filter: null,
            page: "single",
            ...defaultProp,
        }),
        generatWidget({
            id: "registClient",
            method: null,
            chartType: ChartType.GRAPH,
            type: "scatter",
            title: { value: "Rate of Regist Client", align: "left" },
            filter: null,
            page: "single",
            ...defaultProp,
        }),
        generatWidget({
            id: "clientMethod",
            method: serviceMC.getEP().METHOD_CLIENT,
            chartType: ChartType.GRAPH,
            type: "bar",
            title: { value: "Rate of Find Cloudlet", align: "left" },
            filter: null,
            page: "single",
            ...defaultProp,
        }),
        generatWidget({
            id: "eventCloudlet",
            method: serviceMC.getEP().EVENT_CLOUDLET,
            chartType: ChartType.TABLE,
            type: "alarm",
            title: { value: "Events of Cloudlet", align: "center" },
            filter: null,
            page: "single",
            ...defaultProp,
        }),
    ];
};
const generateComponentOperator = (self, infos) => {
    const defaultProp = { sizeInfo: infos.size, self, props: infos.props };
    return [
        generatWidget({
            url: "https://test1",
            chartType: "gauge",
            type: "",
            page: "single",
            ...defaultProp,
        }),
        generatWidget({
            url: "https://test2",
            chartType: "timeseries",
            type: "scatter",
            page: "single",
            ...defaultProp,
        }),
        generatWidget({
            url: "https://test3",
            chartType: "map",
            type: "scatter",
            page: "single",
            ...defaultProp,
        }),
        generatWidget({
            url: "https://test4",
            chartType: "timeseries",
            type: "scatter",
            page: "single",
            ...defaultProp,
        }),
        generatWidget({
            url: "https://test5",
            chartType: "timeseries",
            type: "bar",
            page: "single",
            ...defaultProp,
        }),
        generatWidget({
            url: "https://test6",
            chartType: "table",
            type: "",
            page: "single",
            ...defaultProp,
        }),
    ];
};
