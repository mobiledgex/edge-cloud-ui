import React from "react";
import { SizeMe } from "react-sizeme";
import { compose } from "redux";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";
import uniq from "lodash/uniq";
import cloneDeep from "lodash/cloneDeep";
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

const ContainerWrapper = obj => compose(connect(mapStateToProps, mapDispatchProps), WrapperComponent => class extends React.Component {
    constructor() {
        super();
        _self = this;
        this.firstProps = null;
        this.stackData = [];
        this.groupData = [];
        this.allData = [];
        this.initMethod = "";
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("20200611 did request wrapper props ===== ", nextProps, ":", prevState);
        const update = {};


        return nextProps;
    }


    /* 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출하는 메서드 */
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log("20200611 did request 000 == >>>>>  ", prevProps, ":", prevState);
        console.log("20200610 request 111 check filtered item == >>>>>  prevProps, prevState = ", prevProps.method, ":", prevState.method);
        console.log("20200610 request 222 check filtered item == >>>>>  this props = ", this.props.method, ": this state = ", this.state.method);
        // if (prevState.method && (prevState.method !== this.initMethod) && this.state.appinsts) {
        //     this.initMethod = prevState.method;

        //     console.log("20200611 request 333 == >>>>>  init  ", this.state);
        //     this.initialize(this.state, this);
        //     return true;
        // }
        if (prevState.method && this.props.method && (this.props.method !== this.initMethod) && this.state.appinsts) {
            this.initMethod = this.props.method;

            console.log("20200611 request 444 == >>>>>  init  ", this.state, "    filteringItems = ", prevProps, ":", this.props);
            this.initialize(this.props, this);
            return true;
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    onReceiveResult(result, self, method) {
        try {
            // TODO: 20200507 필터가 있는지 확인 후 데이터 가공
            /** filtering data */
            const groupByData = result;
            if (result && result.length > 0) {
                console.log("20200615 container widget   == 55 == ", result, ":", self.state.id, self.state.method, ": m =", method, ": this state = ", this.state.id);
                if (self.state.id === this.state.id) {
                    this.setState({ data: { [self.state.id]: result, method } });
                }
            }
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
        return uniq(filterItem, "path");
    }

    async initialize(props: MetricsParmaType, self: any) {
        console.log("20200610 request initialize props = ", props.method, ":", props.appinsts);
        try {
            if (props.method === serviceMC.getEP().COUNT_CLUSTER) {
                // count cluster in cloudlet
                const result = await Service.MetricsService(props, self);
                this.onReceiveResult(result, self, props.method);
                // this.onReceiveResult(props.cloudlets, self);
            }
            if (props.method === serviceMC.getEP().METRICS_CLOUDLET) {
                const result = await Service.MetricsService(props, self);
                if (result && result.length > 0) {
                    const reduceResult = this.removeEmptyResult(result);
                    this.onReceiveResult(reduceResult, self, props.method);
                }
            }
            if (props.method === serviceMC.getEP().METRICS_CLUSTER) {
                const result = await Service.MetricsService(props, self);
                if (result && result.length > 0) {
                    const reduceResult = this.removeEmptyResult(result);
                    this.onReceiveResult(reduceResult, self, props.method);
                }
            }
            if (props.method === serviceMC.getEP().METRICS_CLIENT) {
                const result = await Service.MetricsService(props, self);
                if (result && result.length > 0) {
                    const reduceResult = this.removeEmptyResult(result, "values");
                    this.onReceiveResult(reduceResult, self, props.method);
                }
            }
            if (props.method === serviceMC.getEP().EVENT_CLOUDLET) {
                console.log("20200610 filtered === ", props.filteringItems);
                // filtering
                let findIdx = null;
                const newProps = cloneDeep(props);
                if (props.filteringItems && props.filteringItems.cloudlet && props.filteringItems.cloudlet.value) {
                    findIdx = props.cloudlets.findIndex(x => x.cloudletName === props.filteringItems.cloudlet.value);
                    newProps.cloudlets = [];
                    console.log("20200610 props new pro === ", findIdx, ":", props.cloudlets[findIdx], ":", newProps);
                    if (props.cloudlets[findIdx]) newProps.cloudlets = [props.cloudlets[findIdx]];
                }
                console.log("20200610 props new newProps === ", newProps);
                const result = await Service.MetricsService(newProps || props, self);
                if (result && result.length > 0) {
                    // const reduceResult = this.removeEmptyResult(result, "cloudletName");
                    this.onReceiveResult(result, self, props.method);
                }
            }
            if (props.method === serviceMC.getEP().EVENT_CLUSTER) {
                // filtering
                let findIdx = null;
                const newProps = cloneDeep(props);
                if (props.filteringItems && props.filteringItems.cluster && props.filteringItems.cluster.value) {
                    findIdx = props.clusters.findIndex(x => x.clusterName === props.filteringItems.cluster.value);
                    newProps.clusters = [];
                    if (props.clusters[findIdx]) newProps.clusters = [props.clusters[findIdx]];
                }
                const result = await Service.MetricsService(newProps || props, self);
                if (result && result.length > 0) {
                    // const reduceResult = this.removeEmptyResult(result, "values");
                    this.onReceiveResult(result, self, props.method);
                }
            }

            if (props.method === serviceMC.getEP().SHOW_CLUSTER_INST) {
                // filtering
                let findIdx = null;
                const newProps = cloneDeep(props);
                if (props.filteringItems && props.filteringItems.cluster && props.filteringItems.cluster.value) {
                    findIdx = props.clusters.findIndex(x => x.clusterName === props.filteringItems.cluster.value);
                    newProps.clusters = [];
                    console.log("20200615 props new pro === ", findIdx, ":", props.clusters[findIdx], ":", newProps);
                    if (props.clusters[findIdx]) newProps.clusters = [props.clusters[findIdx]];
                }
                console.log("20200615 newProps === ", newProps);
                const result = await Service.MetricsService(newProps, self);
                console.log("20200615 result new result === ", result);
                if (result && result.length > 0) {
                    // const reduceResult = this.removeEmptyResult(result, "values");
                    this.onReceiveResult(result, self, props.method);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const { data, chartType, legendShow, legendInfo, selectedIndex, cloudlets } = this.state;
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
                        legendInfo={legendInfo}
                        selectedIndex={selectedIndex}
                    />
                )}
            </SizeMe>
        );
    }
});

const mapStateToProps = state => {
    const regionInfo = state.regionInfo ? state.regionInfo : null;
    const panelInfo = state.infoPanelReducer ? state.infoPanelReducer : null;
    return {
        regionInfo,
        panelInfo: panelInfo.info,
    };
};
const mapDispatchProps = dispatch => ({
    handleAlertInfo: (mode, msg) => {
        dispatch(actions.alertInfo(mode, msg));
    },
    // handleLoadingSpinner: (data) => {
    //     dispatch(actions.loadingSpinner(data));
    // },
    onLoadComplete: data => {
        _self.onReceiveResult(data);
    },
    handleSavedData: data => {
        dispatch(actions.saveMetricData(data));
    }
});

export default ContainerWrapper;
