import React from "react";
import axios from "axios";

const ContainerWrapper = (url, chartType) => WrapperComponent => {
    return class extends React.Component {
        state = {
            data: null,
            chartType: ""
        };
        async initialize() {
            try {
                const response = await axios.get(url);
                this.setState({
                    data: response.data
                });
            } catch (e) {
                console.log(e);
            }
        }
        componentDidMount() {
            this.setState({ chartType: chartType });
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
