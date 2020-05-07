import React, { useRef } from "react";
import { Paper } from "@material-ui/core";
import _ from "lodash";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import ContainerWrapper from "./ContainerWrapper";
import TimeSeries from "../../../../charts/plotly/timeseries";
import ContainerHealth from "./ContainerHealth";
import Map from "../../../../libs/simpleMaps/with-react-motion/index_clusters";
import CounterWidget from "./CounterWidget";
import { Segment } from "semantic-ui-react";
import MonitoringListViewer from "../components/MonitoringListViewer";
import * as ChartType from "../formatter/chartType";

class ChartWidget extends React.Component {
    state = {
        mapData: [],
        clusterCnt: [0],
        size: { width: 10, height: 10 }
    };

    getData = () => [100, 3, 0, 6, 4, 5, 8, 6, 0, 1];
    componentDidMount() {
        this.divRef = React.createRef();
        setTimeout(() => {
            if (this.divRef.current)
                this.divRef.current.setDataToWidget(this.getData());
        }, 6000);
    }
    componentWillReceiveProps(nextProps, prevProps) {
        console.log(
            "20200430 receive data in the ChartWidget ....",
            nextProps.chartType,
            ":",
            nextProps
        );
        if (nextProps.size !== this.props.size) {
            //this.setState({ size: this.props.size });
        }
    }
    makeChart = props =>
        props.page === "multi" ? (
            <Slider size={props.size} content={props.content}></Slider>
        ) : (
                props.content
            );
    render() {
        const { data, chartType, type, size, title } = this.props;
        //const { size } = this.state;
        return (
            <div
                className="chart-widget"
                style={{
                    height: "100%",
                    backgroundColor: "transparent"
                }}
            >
                {chartType === ChartType.GRAPH ? (
                    <TimeSeries size={size} type={type} data={data} title={title} />
                ) : chartType === ChartType.GAUGE ? (
                    <ContainerHealth size={size} type={type} title={title} />
                ) : chartType === ChartType.MAP ? (
                    <Map
                        size={size}
                        type={type}
                        locData={this.state.mapData}
                        id={"matricMap"}
                        reg="cloudletAndClusterMap"
                        zoomControl={{ center: [0, 0], zoom: 1.5 }}
                        title={title}
                    ></Map>
                ) : chartType === ChartType.COUNTER ? (
                    <CounterWidget
                        size={size}
                        ref={this.divRef}
                        clusterCnt={this.state.clusterCnt}
                        title={title}
                    ></CounterWidget>
                ) : (
                                    <DataGrid size={size} data={data} title={title} />
                                )}
            </div>
        );
    }
}

export default ContainerWrapper()(ChartWidget);

class DataGrid extends React.Component {
    state = {
        data: null,
        size: null
    };
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data, size: nextProps.size });
    }
    render() {
        let { data, size } = this.state;
        return (
            <MonitoringListViewer
                sizeInfo={size}
                data={data}
            ></MonitoringListViewer>
        );
    }
}

/******************************************
 * SLIDER (carousel)
 * http://react-responsive-carousel.js.org/storybook/index.html?path=/story/01-basic--with-custom-status-arrows-and-indicators
 * https://github.com/leandrowd/react-responsive-carousel
 * @param {*} props
 * @Codeby Smith
 *******************************************/
const ItemComp = props => {
    const divRef = React.createRef();
    const clusterCnt = [100, 3, 0, 6, 4, 5, 8, 6, 0, 1];
    return <CounterWidget ref={divRef} clusterCnt={clusterCnt}></CounterWidget>;
};

let checkCount = 0;
class Slider extends React.Component {
    gutterBottom = 0;
    sliderHeight = 150;
    sliderWidth = 300;
    compareSize = null;
    state = {
        items: [
            {
                name: "EU",
                description: "This is name of the cloudlet"
            },
            {
                name: "EU",
                description: "Hello World!"
            },
            {
                name: "EU",
                description: "Hello World!"
            }
        ],
        size: null
    };
    componentWillReceiveProps(nextProps) {
        const _self = this;
        const checkInt = setInterval(() => {
            // console.log(
            //     "20200419  size in Slider = ",
            //     nextProps.size,
            //     ":this.compareSize=",
            //     _self.compareSize,
            //     ": tcompare========== ",
            //     nextProps.size === _self.compareSize
            // );
            if (nextProps.size === _self.compareSize) {
                checkCount++;
            }
            if (checkCount >= 10) {
                checkCount = 0;
                _self.setState({ size: nextProps.size });
                clearInterval(checkInt);
            }
        }, 300);
        this.compareSize = Object.assign(nextProps.size);
    }
    getItem = (item, i, size) => (
        <div
            style={{
                width: size.width,
                height: this.sliderHeight - this.gutterBottom
            }}
        >
            <ItemComp item={this.state.items[0]}></ItemComp>
        </div>
    );
    render() {
        const { size } = this.state;

        return (
            <Carousel
                className="carouselComp"
                autoPlay
                infiniteLoop
                width={size ? size.width : this.sliderWidth}
            >
                {size ? (
                    this.state.items.map((item, i) =>
                        this.getItem(item, i, size)
                    )
                ) : (
                        <div>empty</div>
                    )}
            </Carousel>
        );
    }
}
