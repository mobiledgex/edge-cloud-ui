import React from "react";
// See the list of possible plotly bundles at https://github.com/plotly/plotly.js/blob/master/dist/README.md#partial-bundles or roll your own
// import Plotly from "plotly.js/dist/plotly-cartesian";

// import createPlotlyComponent from "./CreatePlotlyComponent";
import "./styles.css";

import ChartJSComponent from "../ChartJSComponent";

import * as dataType from "../../sites/siteFour/monitoring/formatter/dataType";

// const PlotlyComponent = createPlotlyComponent(Plotly);

// https://plot.ly/python/#layout-options
// https://plot.ly/javascript/axes/#tick-placement-color-and-style
// https://plot.ly/javascript/streaming/

const trace1 = {
    x: [],
    y: [],
    mode: "lines",
    name: "Solid",
    line: {
        dash: "solid",
        width: 4
    }
};

const trace2 = {
    x: [1, 2, 3, 4, 5],
    y: [6, 8, 7, 8, 6],
    mode: "lines",
    name: "dashdot",
    line: {
        dash: "dashdot",
        width: 4
    }
};

const trace3 = {
    x: [1, 2, 3, 4, 5],
    y: [11, 13, 12, 13, 11],
    mode: "lines",
    name: "Solid",
    line: {
        dash: "solid",
        width: 4
    }
};

const trace4 = {
    x: [1, 2, 3, 4, 5],
    y: [16, 18, 17, 18, 16],
    mode: "lines",
    name: "dot",
    line: {
        dash: "dot",
        width: 4
    }
};


const TimeSeries = props => {
    const [vWidth, setVWidth] = React.useState(300);
    const [vHeight, setVHeight] = React.useState(170);
    const [data, setData] = React.useState([]);
    const [chartData, setChartData] = React.useState([trace1]);
    const [layout, setLayout] = React.useState({ datarevision: 0 });
    const [name, setName] = React.useState("Solid");
    const [currentKey, setCurrentKey] = React.useState("");
    const [mode, setMode] = React.useState("line+markers");
    const [type, setType] = React.useState("scatter");
    const [size, setSize] = React.useState({});
    const [showLegend, setShowLegend] = React.useState(false);
    const [legendInfo, setLegendInfo] = React.useState({ id: '', open: false, target: null });
    const [prevPropsId, setPrevPropsId] = React.useState(props.id);
    const [margin, setMargin] = React.useState({
        l: 45,
        r: 3,
        b: 35,
        t: 5,
        pad: 0
    });
    const marginRight = 0;

    let revision = 10;
    const wGab = 10;
    let hGab = props.filterInfo ? 40 : 30;
    const colors = ["#22cccc", "#6699ff", "#ff710a", "#ffce03"];
    const colorsErr = ["#22cccc", "#ff3355", "#6699ff", "#ffce03"];
    const stackAllData = [];
    const stackData = [];
    let loadedCount = 0;
    let maxDataCount = 0;
    const currentPage = 0;


    const y2Range = null;
    const y3Range = null;
    const y2Position = null;
    const y3Position = null;
    const datarevision = 0;

    const usePrevious = value => {
        const ref = React.useRef();
        React.useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    };

    const useCompare = (val: any) => {
        const prevVal = usePrevious(val);
        return prevVal !== val;
    };

    React.useEffect(() => {
        // const hasVal1Changed = useCompare(props.data);
        if (props.size) {
            setTimeout(() => {
                setVWidth(props.size.width);
                setVHeight(props.size.height);
            }, 2000);
        }
        if (props.filterInfo) {
            hGab = 40;
        } else {
            hGab = 30;
        }
        if (props.id) setPrevPropsId(props.id);
        if (props.divide) maxDataCount = props.divide;
        if (props.type) setType(props.type);
        console.log("20200617 useeffect in timesereis 11 = ", props.data, "id = ", props.id);
        // cloudlet
        if (props.data && (props.data !== data) && props.data[props.id]) {
            chartUpdate({
                data: props.data, id: props.id, type: props.type, calculate: props.calculate, filter: props.filter? props.filter: '',
            });
        }
        // client
        if (props.id === dataType.REGISTER_CLIENT || props.id === dataType.FIND_CLOUDLET) {
            if (props.data && props.data.length) {
                chartUpdate({
                    data: props.data[0], id: props.id, type: props.type, calculate: props.calculate
                });
            }
        }
        // cluster
        if (props.id === dataType.RUNNING_CLUSTER_INST) {
            if (props.data && props.data.length) {
                chartUpdate({
                    data: props.data[0], id: props.id, type: props.type, calculate: props.calculate
                });
            }
        }

        if (props.showLegend) {
            setShowLegend(true);
        } else {
            setShowLegend(false);
        }
        if (props.legendInfo) {
            setLegendInfo(props.legendInfo);
        }
        if (props.margin) setMargin(props.margin);
    }, [props]);

    /** chartUpdate ::
    * Stored on the stack whenever data is loaded
    */
    const chartUpdate = prevProps => {
        console.log("20200617 update chart in timesereis 22 = ", prevProps.data, "id = ", prevProps.id, prevProps.filter);
        if (prevProps.id === dataType.NETWORK_CLOUDLET) {
            /* 지우지 말것 : 클라우드렛 헬스에 쓰임 */
            if (prevProps.data[prevProps.id] && prevProps.data[prevProps.id].length > 0) {
                const shortHand = prevProps.data[prevProps.id];
                let selectedItem = prevProps.filter? prevProps.filter : '';
                if (prevProps.method === "") {
                    //selectedItem = "diskUsed";
                }

                shortHand.map(data => {
                    const times = data[0].times[0]; // not use
                    const datas =
                        (selectedItem === 'floatingIpsUsed' || selectedItem === 'ipv4Used') ? data[0].resData_ip[0][selectedItem]
                            :(selectedItem === 'vCpuUsed' || selectedItem === 'memUsed' || selectedItem === 'diskUsed') ? data[0].resData_util[0][selectedItem]
                            : data[0].resData_util[0].diskUsed; // as x & y
                    console.log('20200617 data3343', data[0], datas);
                    const methods = data[0].methods[0]; // as names
                    datas.names = methods;
                    reloadChart( // <--- 데이터 필터링 되고 있으나 셀렉트가 바뀌었을 때 차트 리로드가 안 됨
                        { [methods[0]]: datas },
                        methods[0],
                        type,
                        prevProps.id
                    );
                });

                // stackAllData.push(Object.assign(shortHand));
            }
            // //////////////
        }
        if (prevProps.id === dataType.REGISTER_CLIENT || prevProps.id === dataType.FIND_CLOUDLET) {
            if (prevProps.data[prevProps.id] && prevProps.data[prevProps.id].length > 0) {
                const shortHand = prevProps.data[prevProps.id];

                shortHand.map(data => {
                    const keys = Object.keys(data);
                    const methods = keys;
                    if (keys.indexOf("null") === -1) {
                        reloadChart(
                            { [methods[0]]: data[methods[0]] },
                            methods[0],
                            type,
                            prevProps.id,
                            prevProps.calculate ? "summ" : null
                        );
                    }
                });
            }
        }

        if (prevProps.id === dataType.RUNNING_CLUSTER_INST) {
            // TODO: 필터링이 있을 경우, 선택된(filtered) 된 cloudlet만 표현한다. 그렇지 않을경우 모든 cloudlets 대한 cluster 표현.
            console.log("20200617 update chart in timesereis = ", prevProps.data, "id = ", prevProps.id);
            if (prevProps.data[prevProps.id] && prevProps.data[prevProps.id].length > 0) {
                const shortHand = prevProps.data[prevProps.id];

                // shortHand.map(data => {
                //     const keys = Object.keys(data);
                //     const methods = keys;

                //     reloadChartColumn(
                //         { [methods[0]]: data[methods[0]] },
                //         methods[0],
                //         type,
                //         prevProps.id,
                //         prevProps.calculate ? "summ" : null
                //     );

                // });

                // TEST
                const keys = Object.keys(data);
                const methods = keys;
                reloadChartColumn(
                    { shortHand },
                    methods[0],
                    type,
                    prevProps.id,
                    prevProps.calculate ? "summ" : null
                );
            }
        }
    };

    const summaryArray = items => {
        let added = 0;
        items.map(item => {
            added += item;
        });
        return added;
    };
    /** nemes = ["RegisterClient", "FindCloudlet", "VerifyLocation"] */
    const reloadChart = (data, cloudlet, _type, id, calculate) => {
        let seriesData = null;
        const xAxis = data[cloudlet].x;
        const xCloudlet = data[cloudlet].names;
        const names = data[cloudlet].x;
        const cloudletName = data[cloudlet].names;
        const title = (id === dataType.NETWORK_CLOUDLET) ? "Used" : "Method";
        const unit = (id === dataType.NETWORK_CLOUDLET) ? "GBs" : "Count";
        const appinst = data[cloudlet].names[0];
        const time = (id === dataType.NETWORK_CLOUDLET || id === dataType.REGISTER_CLIENT) ? "Time" : "";
        const summaryX = xCloudlet[0];
        const summaryY = summaryArray(data[cloudlet].y);
        let xValues = [];
        let yValues = [];
        if (calculate === "summ") {
            xValues = [summaryX];
            yValues = [summaryY];
        } else {
            xValues = xCloudlet;
            yValues = data[cloudlet].y;
        }
        /* 속성을 넘겨 받아야 한다. 차트의 타입이 라인 인지 바 인지 */
        seriesData = {
            type: _type,
            x: (id === dataType.NETWORK_CLOUDLET || id === dataType.REGISTER_CLIENT) ? xAxis : xValues,
            y: yValues,
            yaxis: "y",
            text: (id === dataType.NETWORK_CLOUDLET || id === dataType.REGISTER_CLIENT) ? cloudletName : cloudletName,
            name: data[cloudlet].names[0], // legend lable
            mode: "lines+markers",
            // line: {
            //     dash: "solid",
            //     width: 10
            // },
            // marker: { size: 4 },
            hovertemplate: `<i>${title}</i>: %{y:.2f} ${unit}`
                + `<br><b>${time}</b>: %{x}<br>`
                + "<b> %{text} </b>"
                + "<extra></extra>"
        };

        /**
        * 페이지별로 나누어 데이터 표현
        * once draw count of data to one page
        */
        if (stackData.length < maxDataCount) {
            if (Math.floor(loadedCount / maxDataCount) === currentPage) {
                stackData.push(seriesData);
            }
            loadedCount++;
        }
        setChartData({ [id]: stackData });
        revision += 1;
    };

    const reloadChartColumn = (data, cloudlet, _type, id, calculate) => {
        console.log("20200617 in timeseries id = ", id);
        let seriesData = null;
        // const xAxis = data[cloudlet].x;
        // const xCloudlet = data[cloudlet].names;
        // const names = data[cloudlet].x;
        // const cloudletName = data[cloudlet].names;
        const title = (id === dataType.NETWORK_CLOUDLET) ? "Used" : "Method";
        const unit = (id === dataType.NETWORK_CLOUDLET) ? "GBs" : "Count";
        // const appinst = data[cloudlet].names[0];
        const time = (id === dataType.NETWORK_CLOUDLET || id === dataType.REGISTER_CLIENT) ? "Time" : "";
        // const summaryX = xCloudlet[0];
        // const summaryY = summaryArray(data[cloudlet].y);
        // let xValues = [];
        // let yValues = [];
        // if (calculate === "summ") {
        //     xValues = [summaryX];
        //     yValues = [summaryY];
        // } else {
        //     xValues = xCloudlet;
        //     yValues = data[cloudlet].y;
        // }
        /* 속성을 넘겨 받아야 한다. 차트의 타입이 라인 인지 바 인지 */
        /** refer to : https://codepen.io/jamiecalder/pen/NrROeB */
        const clusters = [];
        const powerData = [[], []];
        data.shortHand.map(_data => {
            _data.map((item, i) => {
                const itemKey = Object.keys(item)[0]; // cluster
                clusters.push(itemKey);
                const powerStates = item[itemKey]; // clusters
                powerData[0].push(powerStates.off);
                powerData[1].push(powerStates.on);

            });
        });
        console.log("20200618 power data :: clusters = ", clusters, ": power = ", powerData);
        seriesData = {
            type: _type,
            x: clusters,
            y: powerData,
            yaxis: "y",
            text: "appinstInfoTEST",
            name: "appinstInfoTEST", // legend lable
            mode: "lines+markers",
            hovertemplate: `<i>${title}</i>: %{y:.2f} ${unit}`
                + `<br><b>${time}</b>: %{x}<br>`
                + "<b> %{text} </b>"
                + "<extra></extra>"
        };

        /**
        * 페이지별로 나누어 데이터 표현
        * once draw count of data to one page
        */
        if (stackData.length < maxDataCount) {
            if (Math.floor(loadedCount / maxDataCount) === currentPage) {
                stackData.push(seriesData);
            }
            loadedCount++;
        }
        // 잠시 막음 20200617 ------ ------ 
        // setChartData({ [id]: stackData });
        revision += 1;
        // ****************************** //

        setChartData({ [id]: stackData });
    };

    const resetData = () => {
        setChartData([]);
    };


    return (
        <ChartJSComponent id={prevPropsId} width={vWidth - wGab} height={vHeight - hGab} data={chartData} type={type} legendShow={showLegend} legendInfo={legendInfo} />
    );
};

TimeSeries.defaultProps = {
    margin: {
        l: 45,
        r: 3,
        b: 35,
        t: 5,
        pad: 0
    },
    marginRight: 0,
    showLegend: false,
    y2Range: null,
    y3Range: null,
    y2Position: null,
    y3Position: null
};

//


export default TimeSeries;
