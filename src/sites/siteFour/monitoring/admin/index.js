import React from "react";
import _ from "lodash";
import sizeMe from "react-sizeme";
import MonitoringLayout from "../layout/layout";
//
import ChartWidget from "../container/ChartWidget";

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
                    initialLayout={generateLayout(this.props.size)}
                    sizeInfo={this.props.size}
                    items={generateComponentAdmin(this.props.size)}
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

export default sizeMe({ monitorHeight: true, refreshMode: "debounce" })(
    MonitoringAdmin
);

const generatWidget = info => (
    <ChartWidget
        url={info.url}
        chartType={info.chartType}
        type={info.type}
        size={info.sizeInfo}
    />
);
const generateComponentAdmin = sizeInfo => {
    return [
        generatWidget({
            url: "https://test1",
            chartType: "counter",
            type: "",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test2",
            chartType: "timeseries",
            type: "scatter",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test3",
            chartType: "map",
            type: "scatter",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test4",
            chartType: "carousel",
            type: "scatter",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test5",
            chartType: "timeseries",
            type: "bar",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test6",
            chartType: "table",
            type: "",
            sizeInfo: sizeInfo
        })
    ];
};
const generateComponentOperator = sizeInfo => {
    return [
        generatWidget({
            url: "https://test1",
            chartType: "gauge",
            type: "",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test2",
            chartType: "timeseries",
            type: "scatter",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test3",
            chartType: "map",
            type: "scatter",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test4",
            chartType: "timeseries",
            type: "scatter",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test5",
            chartType: "timeseries",
            type: "bar",
            sizeInfo: sizeInfo
        }),
        generatWidget({
            url: "https://test6",
            chartType: "table",
            type: "",
            sizeInfo: sizeInfo
        })
    ];
};
