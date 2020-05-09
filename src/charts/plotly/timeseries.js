import React from "react";
import _ from "lodash";
import Plot from "react-plotly.js";
import ContainerDimensions from "react-container-dimensions";

import { connect } from "react-redux";
import "./styles.css";
import * as actions from "../../actions";
import serviceMC from "../../sites/siteFour/monitoring/formatter/chartType";


//https://plot.ly/python/#layout-options
//https://plot.ly/javascript/axes/#tick-placement-color-and-style
//https://plot.ly/javascript/streaming/

const trace1 = {
    x: [1, 2, 3, 4, 5],
    y: [1, 3, 2, 3, 1],
    mode: 'lines',
    name: 'Solid',
    line: {
        dash: 'solid',
        width: 4
    }
};

const trace2 = {
    x: [1, 2, 3, 4, 5],
    y: [6, 8, 7, 8, 6],
    mode: 'lines',
    name: 'dashdot',
    line: {
        dash: 'dashdot',
        width: 4
    }
};

const trace3 = {
    x: [1, 2, 3, 4, 5],
    y: [11, 13, 12, 13, 11],
    mode: 'lines',
    name: 'Solid',
    line: {
        dash: 'solid',
        width: 4
    }
};

const trace4 = {
    x: [1, 2, 3, 4, 5],
    y: [16, 18, 17, 18, 16],
    mode: 'lines',
    name: 'dot',
    line: {
        dash: 'dot',
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
            chartData: [
                trace1, trace2, trace3, trace4
            ],
            layout: {
                datarevision: 0
            },
            name: 'Solid',
            currentKey: "",
            revision: 10,
            mode: "line+markers",
            type: "scatter"
        };
        this.wGab = 10;
        this.hGab = 38;
        this.colors = ["#22cccc", "#6699ff", "#ff710a", "#ffce03"];
        this.colorsErr = ["#22cccc", "#ff3355", "#6699ff", "#ffce03"];
        this.stackData = [];
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.data && nextProps.data.length > 0) {
            console.log('20200509 receive data in timeseries--', nextProps)
            let selectedItem = ""
            if (nextProps.method === "") {
                selectedItem = "diskUsed"
            }
            let times = nextProps.data[0].times[0];
            let datas = nextProps.data[0].resData_util[0].diskUsed.y;
            let method = nextProps.data[0].method;
            this.reloadChart(
                datas,
                times,
                method,
                nextProps.single,
                nextProps.dataType,
            );
        }
        console.log(
            "20200409 chart size ... receive -----------------",
            nextProps.size,
            "  type : ",
            nextProps.type
        );
        if (nextProps.size) {
            this.setState({
                vWidth: nextProps.size.width,
                vHeight: nextProps.size.height
            });
        }
    }
    componentDidMount() {
        if (this.props.size) {
            setTimeout(
                () =>
                    this.setState({
                        vWidth: this.props.size.width,
                        vHeight: this.props.size.height
                    }),
                1000
            );
            let cloneData = _.cloneDeep(this.state.chartData);
            cloneData[0].type = this.props.type;
            this.setState({ chartData: cloneData || "scatter" });
        }
        console.log(
            "20200409 chart size ... ",
            this.props.size,
            "  type : ",
            this.props.type
        );
    }
    reloadChart(data, times, names, dataId, dataType) {
        let seriesData = null;
        // let series = times.map((time) => (
        //     d3.TimeSeries()
        // ))

        seriesData =
        {
            mode: "line",
            x: times,
            y: data,
            yaxis: "y",
            name: names,
            line: {
                dash: 'solid',
                width: 1
            },
            marker: { size: 4 }
        }

        if (this.stackData.length < 4) {
            this.stackData.push(seriesData)
        }
        this.setState({
            chartData: this.stackData
        });

        this.setState({ revision: this.state.revision + 1 });
    }
    reloadChartOld(data, series, names, dataId, dataType) {
        let xaxis = series;

        let _data = dataId ? data[parseInt(dataId)] : data;

        let seriesData = null;

        if (!dataId) {
            seriesData = data.map((item, i) => ({
                type: this.state.type,
                mode: this.state.mode,
                x: series,
                y: item,
                yaxis: i === 0 ? "y" : i === 1 ? "y2" : i === 2 ? "y3" : "y",
                name: names && names.length > 0 ? names[i] : "",
                line: {
                    color: this.props.error
                        ? this.colorsErr[i]
                        : this.colors[i],
                    width: 1
                },
                marker: { size: 5 }
            }));
        } else {
            let sData = [];

            _data.map(dt => {
                sData.push(Number(dataType !== "MEM" ? dt : dt * 0.001));
            });
            seriesData = [
                {
                    type: this.state.type,
                    mode: this.state.mode,
                    x: series,
                    y: sData,
                    yaxis: "y",
                    name:
                        names && names.length > 0
                            ? names[parseInt(dataId)]
                            : "",
                    line: {
                        color: this.props.error
                            ? this.colorsErr[parseInt(dataId)]
                            : this.colors[parseInt(dataId)],
                        width: 1
                    },
                    marker: { size: 5 }
                }
            ];
        }

        this.setState({
            chartData: seriesData
        });

        this.setState({ revision: this.state.revision + 1 });
    }

    render() {
        let { error } = this.props;
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
                    className={"plotly-chart"}
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
                            x: 1,
                            y: 1,
                            xanchor: 'bottom',
                            font: {
                                family: 'Roboto',
                                size: 10,
                                color: 'rgb(54, 54, 54)'
                            },
                            bgcolor: '#212121',
                            bordercolor: '#454545',
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
                            //rangemode: 'tozero'
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
                            //rangemode: 'tozero'
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
const mapStateToProps = (state, ownProps) => {
    return {
        currentKey: state.cityChanger.city
    };
};
const mapDispatchProps = dispatch => {
    return {
        handleChangeCity: data => {
            dispatch(actions.changeCity(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(TimeSeries);
