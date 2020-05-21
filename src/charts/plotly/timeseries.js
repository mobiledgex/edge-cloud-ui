import React from "react";
import _ from "lodash";
import Plot from "react-plotly.js";
import ContainerDimensions from "react-container-dimensions";

import { connect } from "react-redux";
import "./styles.css";
import * as actions from "../../actions";
import serviceMC from "../../sites/siteFour/monitoring/formatter/chartType";
import * as dataType from "../../sites/siteFour/monitoring/formatter/dataType";

// https://plot.ly/python/#layout-options
// https://plot.ly/javascript/axes/#tick-placement-color-and-style
// https://plot.ly/javascript/streaming/

const trace1 = {
    x: [1, 2, 3, 4, 5],
    y: [1, 3, 2, 3, 1],
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


class TimeSeries extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 300,
            vHeight: 170,
            data: [],
            dataRaw: [],
            chartData: [
                trace1, trace2, trace3, trace4
            ],
            layout: {
                datarevision: 0
            },
            name: "Solid",
            currentKey: "",
            revision: 10,
            mode: "line+markers",
            type: "scatter",
            size: {}
        };
        this.wGab = 10;
        this.hGab = 38;
        this.colors = ["#22cccc", "#6699ff", "#ff710a", "#ffce03"];
        this.colorsErr = ["#22cccc", "#ff3355", "#6699ff", "#ffce03"];
        this.stackAllData = [];
        this.stackData = [];
        this.loadedCount = 0;
        this.maxDataCount = 0;
        this.currentPage = 0;
    }

    componentDidMount() {
        if (this.props.size) {
            setTimeout(
                () => this.setState({
                    vWidth: this.props.size.width,
                    vHeight: this.props.size.height
                }),
                1000
            );
            const cloneData = _.cloneDeep(this.state.chartData);
            cloneData[0].type = this.props.type;
            this.setState({ chartData: cloneData || "scatter" });
        }
        if (this.props.filterInfo) {
            this.hGab = 38;
        } else {
            this.hGab = 0;
        }
        if (this.props.divide) this.maxDataCount = this.props.divide;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("20200521 shortHand derived state ====== -->> prev :: ", prevState.data, "   next:: ", nextProps.data, ": isEqual=", _.isEqual(prevState.data, nextProps.data));
        if (_.isEqual(prevState.data, nextProps.data) === false) {
            return { data: nextProps.data };
        }
        return null;
    }

    /* 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출하는 메서드 */
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log("20200521 map state to props ==== ", prevProps.savedMetricsData, prevState.savedMetricsData);
        console.log("20200521 shortHand ======getSnapshotBeforeUpdate ++++++++++ ", prevProps.data);
        if (prevState.data !== this.state.data) {
            /* 지우지 말것 : 클라우드렛 헬스에 쓰임 */
            if (prevProps.data[prevProps.id] && prevProps.data[prevProps.id].length > 0 && prevProps.id === dataType.NETWORK_CLOUDLET) {
                const shortHand = prevProps.data[prevProps.id];
                console.log("20200521 shortHand ====== -->> ", shortHand);
                let selectedItem = "";
                if (prevProps.method === "") {
                    selectedItem = "diskUsed";
                }

                const { type } = prevProps;

                shortHand.map(data => {
                    const times = shortHand[0].times[0]; // not use
                    const datas = shortHand[0].resData_util[0].diskUsed; // as x & y
                    const methods = shortHand[0].methods[0]; // as names
                    datas.names = methods;
                    this.reloadChart(
                        { [methods[0]]: datas },
                        methods[0],
                        type
                    );
                });

                this.stackAllData.push(Object.assign(shortHand));
            }

            return true;
        }

        return null;
    }


    componentDidUpdate(prevProps, prevState) {
        console.log("20200521 map state to props ==== ", prevProps.savedMetricsData);
        if (prevProps.savedMetricsData && _.isEqual(prevProps.savedMetricsData, prevState.savedMetricsData) === false) {
            // TODO : select box의 선택에 따른 데이터 교체
            console.log("20200521 map state to props ==== -->> ", prevProps.savedMetricsData, ":    prevProps ==", prevProps);

            let selectedIdx = prevProps.selectedMethod;
            if (prevProps.id === dataType.REGISTER_CLIENT && prevProps.savedMetricsData[prevProps.id]) {
                const mtData = prevProps.savedMetricsData[prevProps.id].values;
                if (mtData.length > 0) {
                    const { cloudlets, methods, resSeries, resColumns } = mtData[0];
                    const dataArray = [];
                    methods.map((method, i) => {
                        if (method === prevProps.id) {
                            dataArray.push(resSeries[i]);
                        }
                    });
                    const datas = {};
                    const { type } = prevProps;
                    const timesX = [];
                    const valueY = [];
                    const cloudletNames = [];
                    dataArray.map(data => {
                        const valueIndex = resColumns.indexOf("reqs");
                        const cloudletIndex = resColumns.indexOf("cloudlet");
                        const timeIndex = resColumns.indexOf("time");
                        timesX.push(data[timeIndex]);
                        valueY.push(data[valueIndex]);
                        cloudletNames.push(data[cloudletIndex]);
                    });

                    const filteredCloudlets = [...new Set(cloudlets)]; /* to avoid duplicated */

                    filteredCloudlets.map(cloudlet => {
                        this.reloadChart(
                            { [cloudlet]: { x: timesX, y: valueY, names: cloudletNames } },
                            cloudlet,
                            type
                        );
                    });

                    //const selectedMethodName = methods[selectedIdx];
                    //const dataArray = prevProps.data[0][selectedMethodName];
                }
            }


            // metics of clients
            // let selectedIdx = prevProps.selectedMethod;
            // if (prevProps.id === dataType.FIND_CLOUDLET) {
            //     selectedIdx = 1;
            // }
            // if (prevProps.data.length > 0) {
            //     const { times } = prevProps.data[0];
            //     const { methods } = prevProps.data[0];
            //     const { cloudlets } = prevProps.data[0];
            //     const { names } = prevProps.data[0];
            //     selectedIdx = methods.indexOf(prevProps.id);
            //     const selectedMethodName = methods[selectedIdx];
            //     const dataArray = prevProps.data[0][selectedMethodName];
            //     console.log("20200518 data .. length ... ", dataArray);
            //     dataArray.map((data, i) => {
            //         const datas = data;
            //         const { type } = prevProps;
            //         console.log("20200517 timeseries data == ", datas);
            //         this.reloadChart(
            //             datas,
            //             cloudlets[i],
            //             type
            //         );
            //     });
            //     this.stackAllData.push(Object.assign(prevProps.data));
            // }
        }

    }

    /** nemes = ["RegisterClient", "FindCloudlet", "VerifyLocation"] */
    reloadChart(data, cloudlet, type) {
        let seriesData = null;

        /* 속성을 넘겨 받아야 한다. 차트의 타입이 라인 인지 바 인지 */
        seriesData = {
            type: type || "line",
            x: data[cloudlet].x,
            y: data[cloudlet].y,
            yaxis: "y",
            text: data[cloudlet].names,
            name: data[cloudlet].names[0],
            mode: "lines+markers",
            // line: {
            //     dash: "solid",
            //     width: 10
            // },
            // marker: { size: 4 },
            hovertemplate: "<i>Count</i>: %{y:.2f}"
                + "<br><b>Time</b>: %{x}<br>"
                + "<b> %{text} </b>"
                + "<extra></extra>"
        };

        /**
        * 페이지별로 나누어 데이터 표현
        * once draw count of data to one page
        */
        if (this.stackData.length < this.maxDataCount) {
            if (Math.floor(this.loadedCount / this.maxDataCount) === this.currentPage) {
                this.stackData.push(seriesData);
            }
            this.loadedCount++;
        }

        this.setState({
            chartData: this.stackData
        });

        this.setState({ revision: this.state.revision + 1 });
    }

    resetData() {
        this.setState({ chartData: [] });
    }

    render() {
        const { error } = this.props;
        return (
            <div
                className="plotContainer"
                style={{
                    display: "flex",
                    overflowY: "hidden",
                    overflowX: "auto"
                }}
            >
                <Plot
                    className="plotly-chart"
                    style={{
                        backgroundColor: "transparent",
                        overflow: "hidden"
                    }}
                    data={this.state.chartData}
                    layout={{
                        title: null,
                        autosize: true,
                        width: this.state.vWidth - this.wGab,
                        height: this.state.vHeight - this.hGab,
                        margin: this.props.margin,
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent",
                        legend: {
                            orientation: "h",
                            x: 0,
                            y: 1,
                            xanchor: "bottom",
                            font: {
                                family: "Roboto",
                                size: 10,
                                color: "rgb(54, 54, 54)"
                            },
                            bgcolor: "#212121",
                            bordercolor: "#454545",
                            borderwidth: 1
                        },
                        showlegend: this.props.showLegend,
                        xaxis: {
                            showgrid: false,
                            zeroline: true,
                            showline: true,
                            mirror: "ticks",
                            gridcolor: "rgba(255,255,255,.05)",
                            gridwidth: 1,
                            zerolinecolor: "rgba(255,255,255,0)",
                            zerolinewidth: 1,
                            linecolor: "rgba(255,255,255,.2)",
                            linewidth: 1,
                            color: "rgba(255,255,255,.4)",
                            domain: [0, 0.94]
                        },
                        yaxis: {
                            showgrid: true,
                            zeroline: false,
                            showline: true,
                            mirror: "ticks",
                            ticklen: 3,
                            tickcolor: "rgba(0,0,0,0)",
                            gridcolor: "rgba(255,255,255,.05)",
                            gridwidth: 1,
                            zerolinecolor: "rgba(255,255,255,0)",
                            zerolinewidth: 1,
                            linecolor: "rgba(255,255,255,.2)",
                            linewidth: 1,
                            color: "rgba(255,255,255,.4)"
                            // rangemode: 'tozero'
                        },
                        yaxis2: {
                            showgrid: true,
                            zeroline: false,
                            showline: true,
                            mirror: "ticks",
                            ticklen: 3,
                            tickcolor: "rgba(0,0,0,0)",
                            gridcolor: "rgba(255,255,255,.05)",
                            gridwidth: 1,
                            zerolinecolor: "rgba(255,255,255,0)",
                            zerolinewidth: 1,
                            linecolor: "rgba(255,255,255,.2)",
                            linewidth: 1,
                            color: "rgba(255,255,255,.4)",
                            overlaying: "y",
                            side: "right",
                            position: this.props.y2Position,
                            range: this.props.y2Range
                            // rangemode: 'tozero'
                        },
                        yaxis3: {
                            showgrid: true,
                            zeroline: false,
                            showline: true,
                            mirror: "ticks",
                            ticklen: 3,
                            tickcolor: "rgba(0,0,0,0)",
                            gridcolor: "rgba(255,255,255,.05)",
                            gridwidth: 1,
                            zerolinecolor: "rgba(255,255,255,0)",
                            zerolinewidth: 1,
                            linecolor: "rgba(255,255,255,.2)",
                            linewidth: 1,
                            color: "rgba(255,255,255,.4)",
                            overlaying: "y",
                            side: "right",
                            position: this.props.y3Position,
                            range: this.props.y3Range
                        },

                        points: {
                            width: 1
                        },
                        hoverlabel: {
                            bordercolor: "rgba(255,255,255,.3)",
                            font: { color: "rgba(255,255,255,.7)" }
                        },
                        hovermode: "closest",
                        datarevision: this.state.datarevision + 1
                    }}
                    revision={this.state.revision}
                />
            </div>
        );
    }
}
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
const mapStateToProps = (state, ownProps) => ({
    currentKey: state.cityChanger.city,
    savedMetricsData: state.saveMetricDataReducer.data
});
const mapDispatchProps = dispatch => ({
    handleChangeCity: data => {
        dispatch(actions.changeCity(data));
    }
});

export default connect(mapStateToProps, mapDispatchProps)(TimeSeries);
