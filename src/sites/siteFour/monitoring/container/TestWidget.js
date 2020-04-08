import React from "react";
import ContainerWrapper from "./ContainerWrapper";

class TestWidget extends React.Component {
    render() {
        const { data, chartType } = this.props;
        return <div>{chartType}</div>;
    }
}

export default ContainerWrapper("http", "lineChart")(TestWidget);
