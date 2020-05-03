import React from "react";
import { Grid, Segment } from "semantic-ui-react";
import BasicGauge from "../../../../charts/plotly/BasicGauge";

const hGap: number = 20;
export default class ContainerHealth extends React.Component {
    state = {
        selfSize: this.props.size || { height: 200 }
    };
    getHeight = () => this.state.selfSize.height - hGap;
    componentDidMount() {}
    componentWillReceiveProps(nextProps) {
        this.setState({ selfSize: nextProps.size });
    }
    render() {
        return (
            <Grid columns={3} style={{ height: this.getHeight() }}>
                <Grid.Row stretched style={{ paddingTop: 2, paddingBottom: 2 }}>
                    <Grid.Column style={{ paddingRight: 2, paddingLeft: 2 }}>
                        {Chart({
                            title: "CPU",
                            column: 3,
                            size: this.state.selfSize
                        })}
                    </Grid.Column>
                    <Grid.Column style={{ paddingRight: 2, paddingLeft: 2 }}>
                        {Chart({
                            title: "MEM",
                            column: 3,
                            size: this.state.selfSize
                        })}
                    </Grid.Column>
                    <Grid.Column style={{ paddingRight: 2, paddingLeft: 2 }}>
                        {Chart({
                            title: "DISK",
                            column: 3,
                            size: this.state.selfSize
                        })}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export const Chart = info => (
    <div
        style={{
            backgroundColor: "transparent",
            width: "100%",
            height: "100%"
        }}
    >
        <BasicGauge
            size={{
                width: info.size.width / info.column,
                height: info.size.height - hGap
            }}
            title={info.title}
        ></BasicGauge>
    </div>
);
