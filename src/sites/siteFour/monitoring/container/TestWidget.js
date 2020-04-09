import React from "react";
import ContainerWrapper from "./ContainerWrapper";
import sizeMe from "react-sizeme";

class TestWidget extends React.Component {
    render() {
        const { data, chartType, size } = this.props;
        return (
            <div style={{ height: "100%" }}>
                {chartType}
                {size.width + ":" + size.height}
            </div>
        );
    }
}

export default sizeMe({ monitorHeight: true })(
    ContainerWrapper("http", "lineChart")(TestWidget)
);
