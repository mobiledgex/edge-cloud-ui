import React, { useRef } from "react";
import ContainerWrapper from "./ContainerWrapper";
import TimeSeries from "../../../../charts/plotly/timeseries";
import ContainerHealth from "./ContainerHealth";
import Map from "../../../../libs/simpleMaps/with-react-motion/index_clusters";
import CounterWidget from "./CounterWidget";

class ChartWidget extends React.Component {
    state = {
        mapData: [],
        clusterCnt: [0]
    };

    getData = () => [100, 3, 0, 6, 4, 5, 8, 6, 0, 1];
    componentDidMount() {
        this.divRef = React.createRef();
        setTimeout(() => {
            if (this.divRef.current)
                this.divRef.current.setDataToWidget(this.getData());
        }, 6000);
    }
    render() {
        const { data, chartType, type, size } = this.props;
        return (
            <div style={{ height: "100%", backgroundColor: "transparent" }}>
                {chartType}
                {size.width + ":" + size.height}
                {chartType === "timeseries" ? (
                    <TimeSeries size={size} type={type} />
                ) : chartType === "gauge" ? (
                    <ContainerHealth size={size} type={type} />
                ) : chartType === "map" ? (
                    <Map
                        size={size}
                        type={type}
                        locData={this.state.mapData}
                        id={"matricMap"}
                        reg="cloudletAndClusterMap"
                        zoomControl={{ center: [0, 0], zoom: 1.5 }}
                    ></Map>
                ) : chartType === "counter" ? (
                    <CounterWidget
                        ref={this.divRef}
                        clusterCnt={this.state.clusterCnt}
                    ></CounterWidget>
                ) : (
                    <DataGrid size={size} data={data} />
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
