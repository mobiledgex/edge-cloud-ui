import React from "react";
import { SizeMe } from "react-sizeme";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../../actions";
import MetricsService from "../services";
import * as serviceMC from "../../../../services/model/serviceMC";
import * as FormatChart from "../formatter/formatChart";

let _self = null;
let hasCloudlets = [];
let doCloudlets = null;
let regionCount = 0;
let count = 0;
let stepTwoCount = 0;
const ContainerWrapper = obj =>
    compose(connect(mapStateToProps, mapDispatchProps), WrapperComponent => {
        return class extends React.Component {
            constructor() {
                super();
                _self = this;
            }
            state = {
                data: [],
                chartType: "",
                chartMethod: ""
            };

            async initialize(props: any, self: any) {
                try {
                    //TODO :
                    console.log(
                        "20200427 initial props ... method..",
                        props.method
                    );

                    if (props.method) {
                        this.setState({ chartMethod: props.method });
                        await MetricsService(props, self);
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            getWidgetData = async (props: any, self: any) => {
                try {
                    let resultData = null;

                    let concatData = [];
                    console.log("20200427 has cloudlet length == ");
                    if (props.method && hasCloudlets.length > 0) {
                        ///////////////
                        let regionMap = hasCloudlets.map(async cloudlets => {
                            let clMap = cloudlets.map(async (cloudlet, i) => {
                                props["cloudletInfo"] = {
                                    cloudlet: {
                                        region: cloudlet.region,
                                        org: cloudlet.operatorName,
                                        name: cloudlet.cloudletName
                                    }
                                };
                                return await MetricsService(props, self);
                            });
                            resultData = await Promise.all(clMap);

                            console.log(
                                "20200427 get widgetData....resultData..",
                                count,
                                ":",
                                resultData
                            );

                            return await concatData.concat(resultData);
                        });
                        return await Promise.all(regionMap);
                        ///////////////
                    }
                } catch (e) {
                    console.log(e);
                }
            };

            async onReceiveResult(result) {
                try {
                    if (result["Cloudlets"]) {
                        hasCloudlets.push(result["Cloudlets"]);
                        count--;
                    } else {
                    }

                    console.log(
                        "20200427 Finally  get widget data ++++ <<<<<< ",
                        result,
                        ":",
                        count
                    );
                    /*********************************************
                     * * STEP # 2
                     * Once loaded cloudlets, get data from MC fallower
                     * cloudlet의 정보를 먼저 가져온 후에 진행
                     *********************************************/
                    if (count <= 0) {
                        let getData = await this.getWidgetData(
                            {
                                method: this.props.method,
                                region: this.props.regionInfo.region
                            },
                            _self
                        );

                        console.log(
                            "20200427 Finally  get widget data ++++ ==== ==================== ",
                            getData
                        );

                        if (getData.length > 0) {
                            /** Just test - delete me */
                            getData.map(data => {
                                data.map((item, i) => {
                                    console.log(
                                        "20200427 data parse fit chartType ----- ",
                                        this.props.chartType,
                                        ":",
                                        item.response.data.data[0].Series[0]
                                    );
                                });
                            });

                            /** set data as format  */
                            console.log(
                                "20200427 format -->> ",
                                FormatChart.makeFormat(
                                    getData,
                                    this.props.chartType
                                )
                            );
                            // this.setState({
                            //     data: FormatChart.formatData(
                            //         getData,
                            //         this.props.chartType
                            //     )
                            // });
                        }
                    }
                } catch (e) {}
            }
            componentDidMount() {
                let _self = this;
                this.setState({ chartType: this.props.chartType });
            }
            componentWillReceiveProps(nextProps) {
                console.log(
                    "20200430 next props in containerWrapper .. ",
                    nextProps
                );
                if (nextProps.cloudlets && nextProps.cloudlets.length > 0) {
                    /*********************************************
                     * STEP # 1
                     * request data from MC server from every widget
                     * has to be name of method
                     *********************************************/

                    count = this.props.regionInfo.region.length;
                    let getData = this.getWidgetData(
                        {
                            method: this.props.method,
                            region: this.props.regionInfo.region
                        },
                        _self
                    );
                    console.log(
                        "20200430 Finally  get widget data ++++ ==== ==================== ",
                        getData
                    );
                    this.initialize();
                }
            }
            render() {
                const { data, chartType } = this.state;
                return (
                    <SizeMe monitorHeight={true}>
                        {({ size }) => (
                            <WrapperComponent
                                {...this.props}
                                data={data}
                                chartType={chartType}
                                size={size}
                            ></WrapperComponent>
                        )}
                    </SizeMe>
                );
            }
        };
    });

const mapStateToProps = state => {
    let regionInfo = state.regionInfo ? state.regionInfo : null;
    return {
        regionInfo: regionInfo
    };
};
const mapDispatchProps = dispatch => {
    return {
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg));
        },
        handleLoadingSpinner: data => {
            dispatch(actions.loadingSpinner(data));
        },
        onLoadComplete: data => {
            _self.onReceiveResult(data);
        }
    };
};

export default ContainerWrapper;
