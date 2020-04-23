import React from "react";
import { SizeMe } from "react-sizeme";
import MetricsService from "../services";

const ContainerWrapper = () => WrapperComponent => {
    return class extends React.Component {
        state = {
            data: null,
            chartType: ""
        };

        async initialize(props: any) {
            try {
                //TODO :
                console.log(
                    "20200423 initial props ... method..",
                    props.method
                );
                if (props.method) {
                    const response = await MetricsService(props);
                    console.log("20200423 init service ==>>>> ", response);
                }
            } catch (e) {
                console.log(e);
            }
        }
        componentDidMount() {
            this.setState({ chartType: this.props.chartType });
            this.initialize(this.props);
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
};

export default ContainerWrapper;
