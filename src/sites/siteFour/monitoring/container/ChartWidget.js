import React, { useRef } from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Dots from "material-ui-dots";
import _ from "lodash";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import ContainerWrapper from "./ContainerWrapper";
import TimeSeries from "../../../../charts/plotly/timeseries";
import ContainerHealth from "./ContainerHealth";
import MatricMapCont from "./MatricMapCont";
import CounterWidget from "./CounterWidget";
import ContainerMethod from "./ContainerMethod";
import BubbleChart from "./BubbleChart";
import MonitoringListViewer from "../components/MonitoringListViewer";
import * as ChartType from "../formatter/chartType";
import * as DataType from "../formatter/dataType";
import FilteringComponent from "../components/FilteringComponent";
import * as DataFormats from "../formatter/dataFormats";

let scope = null;

class ChartWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapData: [],
            clusterCnt: [0],
            size: { width: 10, height: 10 },
            activeStep: 0,
            data: null,
            stackedData: [],
            dataRaw: [],
            resId: "",
            chartType: ""
        };
        this.id = null;
        scope = this;
    }

    componentDidMount() {
        this.id = this.props.id;
        this.setState({ id: this.props.id });
        // this.divRef = React.createRef();
        // setTimeout(() => {
        //     if (this.divRef.current) this.divRef.current.setDataToWidget(this.getData());
        // }, 1000);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }

    /**
    * 첫번째 인자(nextProps) 는 부모 컴포넌트로 부터 전달받는 객체이며,
    * 두번째 인자(prevState) 는 렌더링되기 이전의 state 객체다.
    */
    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("20200605 change props ==>>>>>>>>", nextProps.chartType, ":", prevState.chartType);
        if (prevState.chartType !== nextProps.chartType) {
            // TODO: 20200605 차트가 교체될 수 있도록
            return { chartType: nextProps.chartType };
        }
        if (prevState.data !== nextProps.data) {
            if (nextProps.id === DataType.NETWORK_CLOUDLET) {
                if (nextProps.data && nextProps.data[nextProps.id] && nextProps.data[nextProps.id].length > 0) {
                    return { data: nextProps.data };
                }
            }
        }
        return null;
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     // 랜더링 조건을 여기에 추가한다. data 값이 같으면 랜더링 하지 않음
    //     console.log('shouldComponentUpdate');
    //     if (nextState.data === nextProps.data) return false;
    //     return true;
    // }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {

            if (prevProps.id === DataType.COUNT_CLUSTER) {
                const updatedata = this.props.data[prevProps.id];
                setTimeout(() => this.setState({ data: updatedata }), 500);
            }
            if (prevProps.id === DataType.NETWORK_CLOUDLET) {
                this.updateMetricData(this.props.data[prevProps.id], prevProps.id);
            }
            //

            if (prevProps.id === DataType.REGISTER_CLIENT || prevProps.id === DataType.FIND_CLOUDLET) {
                const updatedata = DataFormats.dataFormatRateRegist(this.props.data[prevProps.id], prevProps.id);
                this.updateClientData(updatedata);
                // for map
                // const cloudletdata = DataFormats.dataFormaFindCloudlet(this.props.data[prevProps.id], this.props.cloudlets);
                // this.updateFindCloudlet(updatedata);
            }
            //
            if (prevProps.id === DataType.EVENT_CLOUDLET) {
                const updatedata = this.props.data[prevProps.id];
                // 잠시 막음 20200610
                console.log("20200610 updatedata == ", updatedata);
                // setTimeout(() => this.setState({ data: updatedata }), 500);
            }

            if (prevProps.id === DataType.METHOD_CLIENT) {
                // TODO : 테이블에 맞게 데이터 포멧 변환 필요
                const updatedata = DataFormats.dataFormatClientList(this.props.data[prevProps.id]);
                setTimeout(() => this.setState({ data: updatedata }), 500);
            }

            if (prevProps.id === DataType.EVENT_CLUSTER) {
                // TODO : 테이블에 맞게 데이터 포멧 변환 필요
                const updatedata = this.props.data[prevProps.id];
                // const updatedata = DataFormats.dataFormatEventCluster(this.props.data[prevProps.id]);
                setTimeout(() => this.setState({ data: updatedata }), 500);
            }

            if (prevProps.id === DataType.COUNT_CLUSTER) {
                // TODO : 테이블에 맞게 데이터 포멧 변환 필요
                const updatedata = DataFormats.dataFormatCounterCluster(this.props.data[prevProps.id]);
                // const updatedata = DataFormats.dataFormatEventCluster(this.props.data[prevProps.id]);
                setTimeout(() => this.setState({ data: updatedata }), 500);
            }
        }

    }

    updateMetricData = uData => {
        setTimeout(() => this.setState({ data: uData }), 500);
    }

    updateClientData = async uData => {
        setTimeout(() => this.setState({ data: uData }), 500);
    }

    updateFindCloudlet = uData => {
        // setTimeout(() => this.setState({ mapData: uData }), 500);
    }

    // componentWillReceiveProps(prevProps, prevState) {
    //     if (prevProps.data !== this.props.data) {
    //         console.log("20200515 method ==  : chart type = ", this.props.chartType, ": id = ", prevProps.id, ": data type = ", DataType.REGISTER_CLIENT);
    //         if (prevProps.id === DataType.REGISTER_CLIENT) {
    //             console.log("20200515 ....... dataFormatRateRegistregist ... ", prevProps);
    //             if (prevProps && prevProps.data && prevProps.data.values) this.setState({ data: DataFormats.dataFormatRateRegist(prevProps.data) });
    //         } else {
    //             this.setState({ data: prevProps.data });
    //         }
    //     }
    // }

    getData = () => [100, 3, 0, 6, 4, 5, 8, 6, 0, 1];

    makeChart = props => (props.page === "multi" ? (
        <Slider size={props.size} content={props.content} />
    ) : (
            props.content
        ));

    setActiveStep = step => {
        this.setState({ activeStep: step });
    }

    render() {
        const {
            type, size, title, legendShow, legendTarget, filter, method, page, id, selectedIndex, cloudlets, calculate, itemCount
        } = this.props;
        const {
            activeStep, mapData, clusterCnt, data, data2, chartType
        } = this.state;
        // const { size } = this.state;
        console.log("20200607 chart type == ", chartType, ":", this.props);
        const pagerHeight = 12;
        const resize = { width: size.width, height: page === "multi" ? size.height - pagerHeight : size.height };
        return (
            <div style={{ height: "100%" }}>
                <div
                    className="chart-widget"
                    style={{
                        height: resize.height,
                        backgroundColor:
                            chartType !== ChartType.COUNTER && chartType !== ChartType.TABLE &&
                                chartType !== ChartType.COUNTERWITHSPARK && chartType !== ChartType.BUBBLECHART ? "#202329" : "transparent",
                    }}
                >
                    {(filter) ? (
                        <FilteringComponent id={id} data={data} filterInfo={filter} />
                    ) : null}
                    {chartType === ChartType.GRAPH ? (
                        <TimeSeries
                            id={id}
                            size={resize}
                            type={type}
                            chartType={chartType}
                            data={data}
                            title={title.value}
                            showLegend={legendShow}
                            legendTarget={legendTarget}
                            method={method}
                            selectedMethod={selectedIndex}
                            filterInfo={filter}
                            divide={10}
                            step={activeStep}
                            calculate={calculate}
                        />
                    ) : chartType === ChartType.GAUGE ? (
                        <ContainerHealth
                            id={id}
                            size={resize}
                            type={type}
                            data={data}
                            chartType={chartType}
                            title={title.value}
                            method={method}
                            step={activeStep}
                        />
                    ) : chartType === ChartType.MAP ? (
                        <MatricMapCont
                            id={id}
                            size={resize}
                            type={type}
                            chartType={chartType}
                            data={data}
                            locData={mapData}
                            cloudlets={cloudlets}
                            id="matricMap"
                            reg="cloudletAndClusterMap"
                            zoomControl={{ center: [0, 0], zoom: 1.5 }}
                            title={title.value}
                            method={method}
                        />
                    ) : chartType === ChartType.COUNTER ? (
                        <CounterWidget
                            id={id}
                            size={resize}
                            type={type}
                            chartType={chartType}
                            data={data}
                            ref={this.divRef}
                            clusterCnt={clusterCnt}
                            title={title.value}
                            method={method}
                            step={activeStep}
                        />
                    ) : chartType === ChartType.COUNTERWITHSPARK ? (
                        <ContainerMethod size={resize} />
                    ) : chartType === ChartType.BUBBLECHART ? (
                        <BubbleChart size={resize} />
                    ) : <MonitoringListViewer id={id} size={resize} type={type} chartType={chartType} data={data} title={title.value} method={method} />
                    }
                </div>
                {page === "multi"
                    ? (
                        <div style={{ height: pagerHeight }}>
                            <DotsMobileStepper id={id} data={data} itemCount={itemCount ? itemCount : null} setActiveStep={this.setActiveStep} />
                        </div>
                    ) : null}
            </div>
        );
    }
}
ChartWidget.defaultProps = {
    method: "not"
};

export default ContainerWrapper()(ChartWidget);


/** ****************************************
 * SLIDER (carousel)
 * http://react-responsive-carousel.js.org/storybook/index.html?path=/story/01-basic--with-custom-status-arrows-and-indicators
 * https://github.com/leandrowd/react-responsive-carousel
 * @param {*} props
 * @Codeby Smith
 ****************************************** */
const ItemComp = props => {
    const divRef = React.createRef();
    const clusterCnt = [100, 3, 0, 6, 4, 5, 8, 6, 0, 1];
    return <CounterWidget ref={divRef} clusterCnt={clusterCnt} />;
};

let checkCount = 0;
class Slider extends React.Component {
    gutterBottom = 0;

    sliderHeight = 150;

    sliderWidth = 300;

    compareSize = null;

    constructor() {
        super();
        this.state = {
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
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
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
            <ItemComp item={this.state.items[0]} />
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
                    this.state.items.map((item, i) => this.getItem(item, i, size))
                ) : (
                        <div>empty</div>
                    )}
            </Carousel>
        );
    }
}

/**
 * DotsMobileStepper
 */

const Pager = withStyles({
    dots: {
        position: "relative",
        padding: 0
    },
    dotOuter: {
        width: 8,
        height: 8,
        padding: "0 4px",
        float: "left",
        position: "absolute"
    },
    dot: {
        width: 8,
        height: 8,
        background: "#fff",
        transition: "all 400ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        borderRadius: 4,
        marginTop: "0 !important",
    }
})(Dots);

const useStyles = makeStyles({
    root: {
        display: "flex",
        width: "100%",
        marginTop: 4,
        height: 8,
        justifyContent: "center"
    }
});


export const DotsMobileStepper = props => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [step, setStep] = React.useState(1);

    const handleNext = idObject => {
        setActiveStep(idObject.index);
        props.setActiveStep(idObject.index);
    };
    React.useEffect(() => {
        console.log('20200609', props.data)
        let stepData = props.data // <----- data form edit

        if (Array.isArray(stepData) && props.itemCount) {
            setStep(Math.ceil(props.data.length / props.itemCount))
        }

    }, [props]);

    return (
        <div className={classes.root}>
            <Pager
                index={activeStep}
                count={step}
                onDotClick={index => handleNext({ index })}

            />
        </div>
    );
};
