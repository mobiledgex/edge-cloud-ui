import React from "react";
import { SizeMe } from "react-sizeme";
import { compose } from "redux";
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../../../../actions";
import * as Service from "../services";
import * as serviceMC from "../../../../services/model/serviceMC";
import * as FormatChart from "../formatter/formatChart";

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
            chartType: "",
            chartMethod: "",
            title: null,
            legendShow: false,
            page: "single",
        };
    }

    componentDidMount() {
        this.setState({ chartType: this.props.chartType, title: this.props.title, page: this.props.page });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.panelInfo) {
            if (nextProps.panelInfo.title.value === this.state.title.value) {
                this.setState({ legendShow: !this.state.legendShow });
            }
        }

        // TODO: 20200509 //데이터가 갱신될 경우 id는 새로 갱신되어 들어온다
        /** *******************************************
             * STEP # 1
             * necessary to get cloudlets from the parent
             ******************************************** */
        // this.firstProps = _.cloneDeep(nextProps.id);
        if (nextProps.id === this.firstProps) return;
        if (nextProps.cloudlets && nextProps.cloudlets.length > 0 && nextProps.method) {
            this.setState({ method: nextProps.method });
            this.initialize(nextProps, this);
        }
        // ////
        if (nextProps.appinsts && nextProps.appinsts.length > 0 && nextProps.method) {
            this.setState({ method: nextProps.method });
            this.initialize(nextProps, this);
        }
    }

    async onReceiveResult(result, self) {
        try {
            // TODO: 20200507 필터가 있는지 확인 후 데이터 가공
            /** filtering data */
            const groupByData = result;


            this.setState({ data: result });
        } catch (e) { }
    }

    async initialize(props: MetricsParmaType, self: any) {
        try {
            if (props.method) {
                this.setState({ chartMethod: props.method });
                const result = await Service.MetricsService(props, self);
                /**
                 * completing service, go to onReceiveResult below lines
                 */
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const { data, chartType, legendShow } = this.state;
        return (
            <SizeMe monitorHeight>
                {({ size }) => (
                    <WrapperComponent
                        {...this.props}
                        data={data}
                        chartType={chartType}
                        size={size}
                        legendShow={legendShow}
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
    handleLoadingSpinner: (data) => {
        dispatch(actions.loadingSpinner(data));
    },
    onLoadComplete: (data) => {
        _self.onReceiveResult(data);
    },
});

export default ContainerWrapper;
