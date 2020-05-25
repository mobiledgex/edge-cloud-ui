import React, { useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import _ from "lodash";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import ContainerWrapper from "./ContainerWrapper";
import TimeSeries from "../../../../charts/plotly/timeseries";
import ContainerHealth from "./ContainerHealth";
import Map from "../../../../libs/simpleMaps/with-react-motion/index_clusters";
import CounterWidget from "./CounterWidget";
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
            resId: ""
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
        if (prevState.data !== nextProps.data) {
            console.log("20200521 container widget   == 55 55  == nextProps.data = ", nextProps.data, ": prevState.data= ", prevState.data, ": id = ", nextProps.id);
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
        if (prevProps.data !== this.props.data && this.props.data[prevProps.id].length > 0) {
            console.log("20200521 container widget   == 66 6 == prevState= ", prevProps.data, ": props data = ", this.props.data, ": id= ", prevProps.id);
            if (prevProps.id === DataType.NETWORK_CLOUDLET) {
                this.updateMetricData(this.props.data[prevProps.id], prevProps.id);
            }
            //
            let updatedata = null;
            if (prevProps.id === DataType.REGISTER_CLIENT || prevProps.id === DataType.FIND_CLOUDLET) {
                updatedata = DataFormats.dataFormatRateRegist(this.props.data[prevProps.id]);
                this.updateClientData(updatedata);
            }
            //
            if (prevProps.id === DataType.EVENT_CLOUDLET) {
                updatedata = this.props.data[prevProps.id];
                setTimeout(() => this.setState({ data: updatedata }), 500);
            }
        }

    }

    updateMetricData = (uData) => {
        setTimeout(() => this.setState({ data: uData }), 500);
    }

    updateClientData = async (uData) => {
        console.log("20200521 container widget   == 77 77  ==", uData);
        setTimeout(() => this.setState({ data: uData }), 500);
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
            chartType, type, size, title, legendShow, filter, method, page, id, selectedIndex
        } = this.props;
        const {
            activeStep, mapData, clusterCnt, data, data2
        } = this.state;
        // const { size } = this.state;
        return (
            <div
                className="chart-widget"
                style={{
                    height: "100%",
                    backgroundColor: "transparent"
                }}
            >
                {(filter) ? (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <FilteringComponent id={id} data={data} filterInfo={filter} />
                    </div>
                ) : null}
                {chartType === ChartType.GRAPH ? (
                    <TimeSeries
                        id={id}
                        size={size}
                        type={type}
                        chartType={chartType}
                        data={data}
                        title={title.value}
                        showLegend={legendShow}
                        method={method}
                        selectedMethod={selectedIndex}
                        filterInfo={filter}
                        divide={4}
                        step={activeStep}
                    />
                ) : chartType === ChartType.GAUGE ? (
                    <ContainerHealth
                        id={id}
                        size={size}
                        type={type}
                        chartType={chartType}
                        title={title.value}
                        method={method}
                    />
                ) : chartType === ChartType.MAP ? (
                    <Map
                        id={id}
                        size={size}
                        type={type}
                        chartType={chartType}
                        data={data}
                        locData={mapData}
                        id="matricMap"
                        reg="cloudletAndClusterMap"
                        zoomControl={{ center: [0, 0], zoom: 1.5 }}
                        title={title.value}
                        method={method}
                    />
                ) : chartType === ChartType.COUNTER ? (
                    <CounterWidget
                        id={id}
                        size={size}
                        type={type}
                        chartType={chartType}
                        data={data}
                        ref={this.divRef}
                        clusterCnt={clusterCnt}
                        title={title.value}
                        method={method}
                    />
                ) : (
                                    <DataGrid id={id} size={size} type={type} chartType={chartType} data={data} title={title.value} method={method} />
                                )}
                {page === "multi"
                    ? (
                        <div style={{ height: 10 }}>
                            <DotsMobileStepper id={id} data={data} setActiveStep={this.setActiveStep} />
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

class DataGrid extends React.Component {
    state = {
        data: null,
        size: null
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data, size: nextProps.size });
    }

    render() {
        const { data, size } = this.state;
        return (
            <MonitoringListViewer
                sizeInfo={size}
                data={data}
            />
        );
    }
}

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

const useStyles = makeStyles({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
});

export const DotsMobileStepper = props => {
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        props.setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
        props.setActiveStep(activeStep - 1);
    };

    return (
        <MobileStepper
            variant="dots"
            steps={3}
            position="static"
            activeStep={activeStep}
            className={classes.root}
            style={{ backgroundColor: "transparent", height: 30 }}
            nextButton={(
                <div size="small" onClick={handleNext} disabled={activeStep === 2}>
                    {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </div>
            )}
            backButton={(
                <div size="small" onClick={handleBack} disabled={activeStep === 0}>
                    {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </div>
            )}
        />
    );
};
