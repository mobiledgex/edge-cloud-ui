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
        this.state = {
            data: [],
            dataRaw: [],
            chartType: "",
            chartMethod: "",
            title: null,
            legendShow: false,
            legendTarget: null,
            page: "single",
            selectedIndex: 0,
            id: null,
            method: "",
            cloudlets: [],
            appinsts: [],
            clusters: [],
            panelInfo: null
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("20200610 wrapper props ===== ", nextProps, ":", prevState.method);
        const update = {};
        if (isEqual(prevState.cloudlets, nextProps.cloudlets) === false) {
            update.cloudlets = nextProps.cloudlets;
        }
        if (isEqual(prevState.appinsts, nextProps.appinsts) === false) {
            update.appinsts = nextProps.appinsts;
        }
        if (isEqual(prevState.clusters, nextProps.clusters) === false) {
            update.clusters = nextProps.clusters;
        }
        if (prevState.method !== nextProps.method) {
            update.method = nextProps.method;
        } else {
            update.method = null;
        }
        if (prevState.id !== nextProps.id) {
            update.id = nextProps.id;
        }
        if (prevState.panelInfo !== nextProps.panelInfo) {
            console.log("20200610 panel info == ", nextProps.panelInfo);
            /*
            info:
            info: "info"
            title: {value: "Health of Cloudlets", align: "left"}
            */
            if (nextProps.panelInfo && nextProps.panelInfo.info === "info" && nextProps.panelInfo.title.value === nextProps.title.value) {
                update.legendShow = !prevState.legendShow;
                update.legendTarget = nextProps.panelInfo.target;
            }
            update.panelInfo = nextProps.panelInfo;
        }
        if (prevState.id !== nextProps.id) {
            update.id = nextProps.id;
        }
        if (prevState.chartType !== nextProps.chartType) {
            update.chartType = nextProps.chartType;
        }

        return Object.keys(update).length ? update : null;
    }

    componentDidMount() {
        this.setState({
            chartType: this.props.chartType, title: this.props.title, page: this.props.page, id: this.props.id, method: this.props.method
        });
    }

    /* 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출하는 메서드 */
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log("20200610 check filtered item == >>>>>  prevProps = ", prevProps.method, ": this props = ", this.props.method, ": this state = ", this.state.method);
        if (prevProps.method !== this.state.method) {
            this.initialize(prevProps, this);
            return true;
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    onReceiveResult(result, self) {
        try {
            // TODO: 20200507 필터가 있는지 확인 후 데이터 가공
            /** filtering data */
            const groupByData = result;
            if (result && result.length > 0) {
                console.log("20200610 container widget   == 55 == ", result, ":", self.state.id);
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
        return uniq(filterItem, "path");
    }

    async initialize(props: MetricsParmaType, self: any) {
        console.log("20200610 initialize props = ", props.method);
        try {
            if (props.method === serviceMC.getEP().COUNT_CLUSTER) {
                // count cluster in cloudlet
                const result = await Service.MetricsService(props, self);
                this.onReceiveResult(result, self);
                // this.onReceiveResult(props.cloudlets, self);
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
                console.log("20200610 filtered === ", props.filteringItems);
                // filtering
                let findIdx = null;
                const newProps = cloneDeep(props);
                if (props.filteringItems.cloudlet && props.filteringItems.cloudlet.value) {
                    findIdx = props.cloudlets.findIndex(x => x.cloudletName === props.filteringItems.cloudlet.value);
                    newProps.cloudlets = [];
                    console.log("20200610 props new pro === ", findIdx, ":", props.cloudlets[findIdx], ":", newProps);
                    if (props.cloudlets[findIdx]) newProps.cloudlets = [props.cloudlets[findIdx]];
                }
                console.log("20200610 props new newProps === ", newProps);
                const result = await Service.MetricsService(newProps || props, self);
                this.onReceiveResult(result, self);
            }
            if (props.method === serviceMC.getEP().EVENT_CLUSTER) {
                const result = await Service.MetricsService(props, self);
                this.onReceiveResult(result, self);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const {
            data, chartType, legendShow, legendTarget, selectedIndex, cloudlets
        } = this.state;
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
                        legendTarget={legendTarget}
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
