import React from "react";
import ContainerWrapper from "./ContainerWrapper";
import TimeSeries from "../../../../charts/plotly/timeseries";

class ChartWidget extends React.Component {
    render() {
        const { data, chartType, type, size } = this.props;
        return (
            <div style={{ height: "100%" }}>
                {chartType}
                {size.width + ":" + size.height}
                {chartType === "timeseries" ? (
                    <TimeSeries size={size} type={type}></TimeSeries>
                ) : (
                    <DataGrid size={size} data={data}></DataGrid>
                )}
            </div>
        );
    }
}

export default ContainerWrapper()(ChartWidget);

class DataGrid extends React.Component {
    render() {
        return <div>DataGrid chart</div>;
    }
}
