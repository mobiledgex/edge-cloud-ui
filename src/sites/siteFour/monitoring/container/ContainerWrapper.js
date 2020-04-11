import React from "react";
import axios from "axios";
import { SizeMe } from "react-sizeme";

const ContainerWrapper = () => WrapperComponent => {
    return class extends React.Component {
        state = {
            data: null,
            chartType: ""
        };
        async initialize() {
            try {
                const response = await axios.get(this.props.url);
                this.setState({
                    data: response.data
                });
            } catch (e) {
                console.log(e);
            }
        }
        componentDidMount() {
            this.setState({ chartType: this.props.chartType });
            this.initialize();
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
