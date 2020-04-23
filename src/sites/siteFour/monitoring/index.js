import React from "react";
import _ from "lodash";
import sizeMe from "react-sizeme";
import MonitoringLayout from "./layout/layout";
import { connect } from "react-redux";
import * as actions from "../../../actions";
//
import ChartWidget from "./container/ChartWidget";
import * as serviceMC from "../../../services/model/serviceMC";

class MonitoringAdmin extends React.Component {
    state = {
        currentBreakpoint: "lg",
        compactType: "vertical",
        mounted: false,
        layouts: { lg: this.props.initialLayout },
        toolbox: { lg: [] }
    };

    componentDidMount() {
        this.setState({ mounted: true });
    }

    render() {
        let _self = this;
        let containerWidth = this.props.size.width;
        let containerHeight = this.props.size.height;
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
                    items={generateComponentAdmin(_self, this.props)}
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
const mapDispatchProps = dispatch => {
    return {
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg));
        },
        handleLoadingSpinner: data => {
            dispatch(actions.loadingSpinner(data));
        },
        onLoadComplete: data => {
            alert(JSON.stringify(data));
        }
    };
};
export default connect(
    null,
    mapDispatchProps
)(sizeMe({ monitorHeight: true, refreshMode: "debounce" })(MonitoringAdmin));

const generatWidget = info => (
    <ChartWidget
        method={info.method}
        chartType={info.chartType}
        type={info.type}
        size={info.sizeInfo}
        wprops={info.props}
        self={info.self}
    />
);
const generateComponentAdmin = (self, infos) => {
    return [
        generatWidget({
            id: "countCluster",
            method: null,
            chartType: "counter",
            type: "",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            id: "networkCloudlet",
            method: null,
            chartType: "timeseries",
            type: "scatter",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            id: "findCloudlet",
            method: null,
            chartType: "map",
            type: "scatter",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            id: "findCloudlet",
            method: null,
            chartType: "carousel",
            type: "scatter",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            id: "findCloudlet",
            method: null,
            chartType: "timeseries",
            type: "bar",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            id: "eventCloudlet",
            method: serviceMC.getEP().EVENT_CLOUDLET,
            chartType: "table",
            type: "",
            sizeInfo: infos.size,
            self,
            props: infos.props
        })
    ];
};
const generateComponentOperator = (self, infos) => {
    return [
        generatWidget({
            url: "https://test1",
            chartType: "gauge",
            type: "",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            url: "https://test2",
            chartType: "timeseries",
            type: "scatter",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            url: "https://test3",
            chartType: "map",
            type: "scatter",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            url: "https://test4",
            chartType: "timeseries",
            type: "scatter",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            url: "https://test5",
            chartType: "timeseries",
            type: "bar",
            sizeInfo: infos.size,
            self,
            props: infos.props
        }),
        generatWidget({
            url: "https://test6",
            chartType: "table",
            type: "",
            sizeInfo: infos.size,
            self,
            props: infos.props
        })
    ];
};
