import React from "react";
import Plot from "react-plotly.js";

class BasicGauge extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 600,
            vHeight: 300
        };
    }
    componentWillReceiveProps(nextProps) {
        console.log(
            "update props... simple    -",
            JSON.stringify(nextProps.size)
        );
        //this.setState({vWidth:nextProps.size.width, vHeight:nextProps.size.height})
    }
    render() {
        const { width, height } = this.props.size;
        const { title } = this.props;
        return (
            <Plot
                const
                data={[
                    {
                        type: "indicator",
                        mode: "gauge+number+delta",
                        value: 420,
                        title: { text: title, font: { size: 12 } },
                        delta: {
                            reference: 400,
                            increasing: { color: "#ffa500" }
                        },
                        gauge: {
                            axis: {
                                range: [null, 500],
                                tickwidth: 1,
                                tickcolor: "darkblue"
                            },
                            bar: { color: "darkblue" },
                            bgcolor: "white",
                            borderwidth: 2,
                            bordercolor: "gray",
                            steps: [
                                { range: [0, 250], color: "cyan" },
                                { range: [250, 400], color: "royalblue" }
                            ],
                            threshold: {
                                line: { color: "red", width: 4 },
                                thickness: 0.75,
                                value: 490
                            }
                        }
                    }
                ]}
                const
                layout={{
                    width: width,
                    height: height,
                    margin: { t: 25, r: 25, l: 25, b: 25 },
                    paper_bgcolor: "transparent",
                    font: { color: "#eeeeee", family: "Arial" },
                    title: { position: "bottom" }
                }}
            />
        );
    }
}
BasicGauge.defaultProps = {
    width: 300,
    height: 200,
    title: "No Title"
};
export default BasicGauge;
