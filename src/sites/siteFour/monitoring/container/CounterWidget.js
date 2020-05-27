import React, {
    useState, forwardRef, useImperativeHandle, useEffect
} from "react";
import CountUp from "react-countup";
import { useCountUp } from "use-count-up";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import isEqual from "lodash/isEqual";
import { dataFormatCountCluster } from "../formatter/dataFormats";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary
    }
}));
const CounterWidget = forwardRef((props, ref) => {
    const [clusterCnt, setClusterCnt] = useState(props);
    const [data, setData] = useState(props.data);
    const [step, setStep] = useState(0);
    const [gridCnt, setGridCnt] = useState(6);
    const [initial, setInitial] = useState(false);

    const classes = useStyles();
    const setDataToWidget = value => {
        // setClusterCnt(value);
    };
    useImperativeHandle(ref, () => ({
        setDataToWidget
    }));
    useEffect(() => {
        console.log("20200521 container widget   == 1111 cloutlet props data == ", props.data, ": init == ", initial, ": step = ", props.step);
        if (props.step !== step) {
            setStep(props.step);
            setData(null);
        }
        if (isEqual(props.data, data) === false && !initial) {
            setInitial(true);
            const formatedData = dataFormatCountCluster(props.data);
            console.log("20200521 container widget   == 1111 groupBy cloudlet == ", formatedData);
            const containerData = [];
            const keys = Object.keys(formatedData);
            keys.map(key => {
                containerData.push({
                    data: formatedData[key], count: formatedData[key].length, region: formatedData[key][0].region, cloudlet: key, clusters: formatedData[key]
                });
            });
            setClusterCnt(containerData);
            setTimeout(() => setInitial(false), 500);
        }
        setData(props.data);
    }, [props]);

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs>
                    <Paper className={classes.paper} style={{ padding: 5 }}>
                        {makeContainer(clusterCnt, (step * gridCnt) + 0, step)}
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper} style={{ padding: 5 }}>
                        {makeContainer(clusterCnt, (step * gridCnt) + 1, step)}
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper} style={{ padding: 5 }}>
                        {makeContainer(clusterCnt, (step * gridCnt) + 2, step)}
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs>
                    <Paper className={classes.paper} style={{ padding: 5 }}>
                        {makeContainer(clusterCnt, (step * gridCnt) + 3, step)}
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper} style={{ padding: 5 }}>
                        {makeContainer(clusterCnt, (step * gridCnt) + 4, step)}
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper} style={{ padding: 5 }}>
                        {makeContainer(clusterCnt, (step * gridCnt) + 5, step)}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
});

export default CounterWidget;

const makeContainer = (clusterData, index, step) => (
    <div style={{ height: 90 }}>
        {(clusterData[index])
            ? (
                <div style={{ width: "100%", height: "100%" }}>
                    <div
                        style={{
                            minWidth: 50,
                            minHeight: 30,
                            padding: 2,
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <span>{clusterData[index].region}</span>
                        <div style={{ fontSize: 26 }}>
                            <CountUp isCounting end={clusterData[index].count} duration={3.2} />
                        </div>
                        <span>{clusterData[index].cloudlet}</span>
                    </div>
                </div>
            ) : null}
    </div>
);
