import React from "react";
import axios from "axios";

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
                <WrapperComponent
                    {...this.props}
                    data={data}
                    chartType={chartType}
                ></WrapperComponent>
            );
        }
    };
};

export default ContainerWrapper;
