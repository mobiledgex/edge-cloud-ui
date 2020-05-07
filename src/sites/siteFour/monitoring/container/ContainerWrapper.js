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

type MetricsParmaType = {
    id: string,
    method: string | null,
    chartType: string,
    type: string,
    sizeInfo: Object,
    self: any
};

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
                chartMethod: "",
                title: null
            };



            async initialize(props: MetricsParmaType, self: any) {
                try {
                    //TODO :
                    console.log(
                        "20200430 initial props ... method..",
                        props.method
                    );

                    if (props.method) {
                        this.setState({ chartMethod: props.method });
                        let result = await MetricsService(props, self);
                        /**
                         * completing service, go to onReceiveResult below lines
                         */
                        console.log("20200507 result == ", result)
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            async onReceiveResult(result, self) {
                try {
                    console.log(
                        "20200507 ------->>>>>>>>>>",
                        JSON.stringify(result)
                    );
                    // TODO: 20200507 필터가 있는지 확인 후 데이터 가공




                    this.setState({ data: result });
                } catch (e) { }
            }
            componentDidMount() {
                console.log('20200507 did mount == ', this.props.title)
                this.setState({ chartType: this.props.chartType, title: this.props.title });

            }
            componentWillReceiveProps(nextProps) {
                if (
                    nextProps.cloudlets &&
                    nextProps.cloudlets.length > 0 &&
                    nextProps.method
                ) {
                    /*********************************************
                     * STEP # 1
                     * necessary to get cloudlets from the parent
                     *********************************************/
                    console.log("20200507 did next props..", this.state.title)
                    this.initialize(nextProps, this);
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
