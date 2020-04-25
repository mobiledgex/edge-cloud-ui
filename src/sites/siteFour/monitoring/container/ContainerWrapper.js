import React from "react";
import { SizeMe } from "react-sizeme";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../../actions";
import MetricsService from "../services";

const ContainerWrapper = obj =>
    compose(connect(mapStateToProps, mapDispatchProps), WrapperComponent => {
        return class extends React.Component {
            state = {
                data: null,
                chartType: ""
            };

            async initialize(props: any, self: any) {
                try {
                    //TODO :
                    console.log(
                        "20200423 initial props ... method..",
                        props.method
                    );
                    if (props.method) {
                        const response = await MetricsService(props, self);
                        console.log("20200423 init service ==>>>> ", response);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            componentDidMount() {
                let _self = this;
                this.setState({ chartType: this.props.chartType });
                this.initialize(this.props, _self);
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
            console.log(
                "20200423 receive from data ++++ ==== ==================== ",
                JSON.stringify(data)
            );
        }
    };
};

export default ContainerWrapper;
