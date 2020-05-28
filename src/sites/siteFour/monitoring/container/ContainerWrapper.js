import React from "react";
import { SizeMe } from "react-sizeme";
import { compose } from "redux";
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../../../../actions";
import * as Service from "../services";
import * as serviceMC from "../../../../services/model/serviceMC";
import * as FormatChart from "../formatter/formatChart";
import * as Util from "../../../../utils";

let _self = null;
const hasCloudlets = [];
const doCloudlets = null;
const regionCount = 0;
const count = 0;
const stepTwoCount = 0;

type MetricsParmaType = {
    id: string,
    method: string | null,
    chartType: string,
    type: string,
    sizeInfo: Object,
    self: any
};

const ContainerWrapper = (obj) => compose(connect(mapStateToProps, mapDispatchProps), (WrapperComponent) => class extends React.Component {
    constructor() {
        super();
        _self = this;
        this.firstProps = null;
        this.stackData = [];
        this.groupData = [];
        this.allData = [];
        this.state = {
            data: [],
            dataRaw: [],
            chartType: "",
            chartMethod: "",
            title: null,
            legendShow: false,
            page: "single",
            selectedIndex: 0,
            id: null,
            method: null,
            cloudlets: [],
            appinsts: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("20200521 container widget  prevState.legendShow == ", prevState.legendShow);
        if (_.isEqual(prevState.cloudlets, nextProps.cloudlets) === false) {
            return { cloudlets: nextProps.cloudlets };
        }
        if (_.isEqual(prevState.appinsts, nextProps.appinsts) === false) {
            return { appinsts: nextProps.appinsts };
        }
        if (prevState.method !== nextProps.method) {
            return { method: nextProps.method };
        }
        if (prevState.id !== nextProps.id) {
            return { id: nextProps.id };
        }
        if (nextProps.panelInfo) {
            console.log("20200528 id === ", prevState.id, ": panel info == ", nextProps.panelInfo);
            //if (nextProps.panelInfo.title.value === prevState.title.value) {
            return { legendShow: nextProps.panelInfo };
            //}
        }
        if (nextProps.id) {
            return { id: nextProps.id };
        }

        return null;
    }

    componentDidMount() {
        this.setState({ chartType: this.props.chartType, title: this.props.title, page: this.props.page, id: this.props.id });
    }

    /* 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출하는 메서드 */


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.cloudlets !== this.state.cloudlets && this.state.method) {
            console.log("20200521 container widget   <<== 33 3 == state = ", this.state.method, ": method= ", prevProps.method, ":", prevState.method);
            // TODO: 20200509 //데이터가 갱신될 경우 id는 새로 갱신되어 들어온다
            /** *******************************************
            * STEP # 1
            * necessary to get cloudlets from the parent
            ******************************************** */
            if (this.state.cloudlets && this.state.cloudlets.length > 0 && this.state.method) {
                this.initialize(this.state, this);
            }
        }
        if (prevProps.appinsts !== this.state.appinsts && this.state.method) {
            if (this.state.appinsts && this.state.appinsts.length > 0 && this.state.method) {
                console.log("20200521 container widget   == 33 appinsts == ", this.state.appinsts, ": method= ", prevProps.method);
                this.initialize(this.state, this);
            }
        }
    }

    onReceiveResult(result, self) {
        try {
            // TODO: 20200507 필터가 있는지 확인 후 데이터 가공
            /** filtering data */
            const groupByData = result;
            if (result && result.length > 0) {
                console.log("20200521 container widget   == 55 == ", result, ":", self.state.id);
            }
            this.setState({ data: { [self.state.id]: result } });
        } catch (e) { }
    }

    removeEmptyResult = (result, sub) => {
        const filterItem = [];
        if (sub) {
            result.map((item, i) => {
                if (item[sub].length > 0) {
                    filterItem.push(item);
                }
            });
        } else {
            result.map((item, i) => {
                if (item.length > 0) {
                    filterItem.push(item);
                }
            });
        }
        return _.uniq(filterItem, "path");
    }

    async initialize(props: MetricsParmaType, self: any) {
        try {
            if (props.method === serviceMC.getEP().COUNT_CLUSTER) {
                // count cluster in cloudlet
                const result = await Service.MetricsService(props, self);
                this.onReceiveResult(result, self);
                //this.onReceiveResult(props.cloudlets, self);
            }
            if (props.method === serviceMC.getEP().METRICS_CLOUDLET) {
                const result = await Service.MetricsService(props, self);
                if (result && result.length > 0) {
                    const reduceResult = this.removeEmptyResult(result);
                    this.onReceiveResult(reduceResult, self);
                }
            }
            if (props.method === serviceMC.getEP().METRICS_CLIENT) {
                const result = await Service.MetricsService(props, self);
                if (result && result.length > 0) {
                    const reduceResult = this.removeEmptyResult(result, "values");
                    this.onReceiveResult(reduceResult, self);
                }
            }
            if (props.method === serviceMC.getEP().EVENT_CLOUDLET) {
                const result = await Service.MetricsService(props, self);
                this.onReceiveResult(result, self);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const { data, chartType, legendShow, selectedIndex, cloudlets } = this.state;
        return (
            <SizeMe monitorHeight>
                {({ size }) => (
                    <WrapperComponent
                        {...this.props}
                        cloudlets={cloudlets}
                        data={data}
                        chartType={chartType}
                        size={size}
                        legendShow={legendShow}
                        selectedIndex={selectedIndex}
                    />
                )}
            </SizeMe>
        );
    }
});

const mapStateToProps = (state) => {
    const regionInfo = state.regionInfo ? state.regionInfo : null;
    const panelInfo = state.infoPanelReducer ? state.infoPanelReducer : null;
    return {
        regionInfo,
        panelInfo: panelInfo.info,
    };
};
const mapDispatchProps = (dispatch) => ({
    handleAlertInfo: (mode, msg) => {
        dispatch(actions.alertInfo(mode, msg));
    },
    // handleLoadingSpinner: (data) => {
    //     dispatch(actions.loadingSpinner(data));
    // },
    onLoadComplete: (data) => {
        _self.onReceiveResult(data);
    },
    handleSavedData: (data) => {
        dispatch(actions.saveMetricData(data));
    }
});

export default ContainerWrapper;
