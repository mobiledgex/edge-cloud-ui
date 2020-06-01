import React from "react";
import { Grid, Segment } from "semantic-ui-react";
// import BasicGauge from "../../../../charts/plotly/BasicGauge";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "../../../../chartGauge/circularProgress";
// import GradientProgress from "../../../../chartGauge/GradientProgress";

const hGap = 20;
const ContainerHealth = defaultProps => {
    const [selfSize, setSelfSize] = React.useState(defaultProps.size);
    const [cpuUsed, setCpuUsed] = React.useState(0);

    const getHeight = () => selfSize.height - hGap;
    React.useEffect(() => {
        console.log("20200601 health data == ", defaultProps);
        setSelfSize(defaultProps.size);
        // setCpuUsed(defaultProps.data.cpuUsed);
        setCpuUsed(87);
    }, [defaultProps]);


    return (
        <Grid columns={3} style={{ height: getHeight() }}>
            <Grid.Row stretched style={{ paddingTop: 2, paddingBottom: 2 }}>
                <Grid.Column style={{ paddingRight: 2, paddingLeft: 2 }}>
                    <CircularProgress data={cpuUsed} />
                    <Typography variant="h6" gutterBottom>
                        VCPU
                    </Typography>
                </Grid.Column>
                <Grid.Column style={{ paddingRight: 2, paddingLeft: 2 }}>
                    <CircularProgress />
                    <Typography variant="h6" gutterBottom>
                        MEM
                    </Typography>
                </Grid.Column>
                <Grid.Column style={{ paddingRight: 2, paddingLeft: 2 }}>
                    <CircularProgress />
                    <Typography variant="h6" gutterBottom>
                        DISK
                    </Typography>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
export default ContainerHealth;
