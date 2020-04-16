import React from "react";
import { SizeMe } from "react-sizeme";
import MetricsCloudlet from "../services/serviceMetricCloudlet";

const ContainerWrapper = () => WrapperComponent => {
    return class extends React.Component {
        state = {
            data: null,
            chartType: ""
        };

        async initialize(type: string) {
            try {
                // const response = await axios.get(this.props.url);
                // this.setState({
                //     data: response.data
                // });
                const response = await MetricsCloudlet(type);
                console.log("20200414 init service ==>>>> ", response);
            } catch (e) {
                console.log(e);
            }
        }
        componentDidMount() {
            this.setState({ chartType: this.props.chartType });
            this.initialize(this.props.chartType);
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
