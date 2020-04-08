import React from "react";
import _ from "lodash";
import MonitoringLayout from "./layout";

export default class MonitoringAdmin extends React.Component {
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
        let containerWidth = this.props.sizeInfo.width;
        let containerHeight = this.props.sizeInfo.height;
        return (
            <div
                style={{
                    width: "100%",
                    height: `${containerHeight}px`,
                    backgroundColor: "#ababab"
                }}
            >
                <div>{containerWidth}</div>
                <div>{containerHeight}</div>
                <MonitoringLayout
                    initialLayout={generateLayout(this.props.sizeInfo)}
                    sizeInfo={this.props.sizeInfo}
                ></MonitoringLayout>
            </div>
        );
    }
}

/**
 * You can get layout value in here..  try it.
 * https://strml.github.io/react-grid-layout/examples/6-dynamic-add-remove.html
 * Displayed as [x, y, w, h]:
0: [0, 0, 3, 2]
1: [0, 2, 3, 2]
2: [3, 0, 6, 4]
3: [9, 0, 3, 2]
4: [9, 2, 3, 2]
5: [0, 4, 12, 2]
 */
let headerTitle = ["Title1", "Title2", "Title3", "Title4", "Title5", "Title6"];
let itemX = [0, 0, 3, 3 + 6, 3 + 6, 0];
let itemY = [0, 2, 0, 0, 2, 4];
let itemWidth = [3, 3, 6, 3, 3, 12];
let itemHeight = [1, 1, 2, 1, 1, 1]; // impact from setting rowHeight for grid layout props
const raw = 3;

const generateLayout = sizeInfo => {
    return headerTitle.map((title, i) => {
        return {
            x: itemX[i],
            y: itemY[i],
            w: itemWidth[i],
            h: itemHeight[i],
            i: title,
            static: false,
            isDraggable: true
        };
    });
};
