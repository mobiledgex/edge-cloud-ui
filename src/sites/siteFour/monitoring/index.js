import React from "react";
import _ from "lodash";
import sizeMe from "react-sizeme";
import MonitoringLayout from "./layout/layout";
import { connect } from "react-redux";
import * as actions from "../../../actions";
//
import MetricsService from "./services";
import ChartWidget from "./container/ChartWidget";
import * as serviceMC from "../../../services/model/serviceMC";
import * as ChartType from "./formatter/chartType";

let doCloudlets = null;
let regionCount = 0;
let count = 0;
let stepTwoCount = 0;
let _self = null;
class MonitoringAdmin extends React.Component {
    constructor() {
        super();
        _self = this;
        this.state = {
            currentBreakpoint: "lg",
            compactType: "vertical",
            mounted: false,
            layouts: { lg: [] },
            toolbox: { lg: [] },
            compCloudlet: [],
            filteredCloudlet: []
        };
    }

    hasCloudlets = [];

    async initialize(props: any, self: any) {
        try {
            //TODO :

            if (props.method) {
                await MetricsService(props, self);
            }
        } catch (e) {
            console.log(e);
        }
    }

    componentDidMount() {
        this.setState({
            urrentBreakpoint: "lg",
            compactType: "vertical",
            mounted: true,
            layouts: { lg: this.props.initialLayout },
            toolbox: { lg: [] }
        });
        /**
         * Necessary list of cloudlet to request metrics info
         */
        let regions = localStorage.regions.split(",");
        if (this.hasCloudlets.length === 0 && !doCloudlets) {
            doCloudlets = true;
            regionCount = regions.length;
            count = regions.length;
            this.initialize(
                {
                    method: serviceMC.getEP().SHOW_CLOUDLET,
                    region: regions
                },
                this
            );
        }
    }

    componentWillReceiveProps(nextProps) {}
    onReceiveResult(result) {
        try {
            if (result["Cloudlets"]) {
                this.hasCloudlets = this.hasCloudlets.concat(
                    result["Cloudlets"]
                );
                count--;
            } else {
            }

            if (count <= 0) {
                console.log("20200430 this.hasCloudlets = ", this.hasCloudlets);
                this.setState({
                    compCloudlet: this.hasCloudlets,
                    filteredCloudlet: this.hasCloudlets
                });
            }
        } catch (e) {
            throw e;
        }
    }

    render() {
        let _self = this;
        let containerWidth = this.props.size.width;
        let containerHeight = this.props.size.height;
        let { filteredCloudlet } = this.state;
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#ababab"
                }}
            >
                <div>{containerWidth}</div>
                <div>{containerHeight}</div>
                <MonitoringLayout
                    initialLayout={generateLayout(this.props)}
                    sizeInfo={this.props.size}
                    items={generateComponentAdmin(
                        _self,
                        this.props,
                        filteredCloudlet
                    )}
                ></MonitoringLayout>
            </div>
        );
    }
}

/**
 * You can get layout value in here..  try it.
 * https://strml.github.io/react-grid-layout/examples/6-dynamic-add-remove.html
 * Displayed as [x, y, w, h]:
 */
let headerTitle = ["Title1", "Title2", "Title3", "Title4", "Title5", "Title6"];
let itemX = [0, 0, 3, 3 + 6, 3 + 6, 0];
let itemY = [0, 2, 0, 0, 2, 4];
let itemWidth = [3, 3, 6, 3, 3, 12];
let itemHeight = [1, 1, 2, 1, 1, 1]; // impact from setting rowHeight for grid layout props
const raw = 3;

const generateLayout = size => {
    return headerTitle.map((title, i) => {
        return {
            x: itemX[i],
            y: itemY[i],
            w: itemWidth[i],
            h: itemHeight[i],
            i: title,
            idx: i,
            static: false,
            isDraggable: true
        };
    });
};
const mapStateToProps = state => {
    let regionInfo = state.regionInfo ? state.regionInfo : null;
    return {
        regionInfo: regionInfo
    };
};
const mapDispatchProps = dispatch => {
    return {
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg));
        },
        handleLoadingSpinner: data => {
            dispatch(actions.loadingSpinner(data));
        },
        onLoadComplete: data => {
            _self.onReceiveResult(data);
        }
    };
};
export default connect(
    mapStateToProps,
    mapDispatchProps
)(sizeMe({ monitorHeight: true, refreshMode: "debounce" })(MonitoringAdmin));

const generatWidget = info => (
    <ChartWidget
        id={info.id}
        method={info.method}
        chartType={info.chartType}
        type={info.type}
        size={info.sizeInfo}
        cloudlets={info.cloudlets}
    />
);
const generateComponentAdmin = (self, infos, cloudlets) => {
    let defaultProp = {
        sizeInfo: infos.size,
        self: self,
        cloudlets: cloudlets
    };
    return [
        generatWidget({
            id: "countCluster",
            method: null,
            chartType: ChartType.COUNTER,
            type: "",
            page: "multi",
            itemCount: 6,
            ...defaultProp
        }),
        generatWidget({
            id: "networkCloudlet",
            method: null,
            chartType: ChartType.GRAPH,
            type: "scatter",
            page: "single",
            ...defaultProp
        }),
        generatWidget({
            id: "findCloudlet",
            method: null,
            chartType: ChartType.MAP,
            type: "scatter",
            page: "single",
            ...defaultProp
        }),
        generatWidget({
            id: "registClient",
            method: null,
            chartType: ChartType.GRAPH,
            type: "scatter",
            page: "single",
            ...defaultProp
        }),
        generatWidget({
            id: "clientMethod",
            method: serviceMC.getEP().METHOD_CLIENT,
            chartType: ChartType.GRAPH,
            type: "bar",
            page: "single",
            ...defaultProp
        }),
        generatWidget({
            id: "eventCloudlet",
            method: serviceMC.getEP().EVENT_CLOUDLET,
            chartType: ChartType.TABLE,
            type: "alarm",
            page: "single",
            ...defaultProp
        })
    ];
};
const generateComponentOperator = (self, infos) => {
    let defaultProp = { sizeInfo: infos.size, self, props: infos.props };
    return [
        generatWidget({
            url: "https://test1",
            chartType: "gauge",
            type: "",
            page: "single",
            ...defaultProp
        }),
        generatWidget({
            url: "https://test2",
            chartType: "timeseries",
            type: "scatter",
            page: "single",
            ...defaultProp
        }),
        generatWidget({
            url: "https://test3",
            chartType: "map",
            type: "scatter",
            page: "single",
            ...defaultProp
        }),
        generatWidget({
            url: "https://test4",
            chartType: "timeseries",
            type: "scatter",
            page: "single",
            ...defaultProp
        }),
        generatWidget({
            url: "https://test5",
            chartType: "timeseries",
            type: "bar",
            page: "single",
            ...defaultProp
        }),
        generatWidget({
            url: "https://test6",
            chartType: "table",
            type: "",
            page: "single",
            ...defaultProp
        })
    ];
};
