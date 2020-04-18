import React, { useState, forwardRef, useImperativeHandle } from "react";
import CountUp from "react-countup";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: "center",
            color: theme.palette.text.secondary
        }
    })
);
const CounterWidget = forwardRef((props, ref) => {
    console.log("20200418 props== ", props);
    const [clusterCnt, setClusterCnt] = useState(props);

    const classes = useStyles();
    const setDataToWidget = value => {
        console.log("20200418 setDataToWidget== ", value);
        setClusterCnt(value);
    };
    useImperativeHandle(ref, () => {
        return {
            setDataToWidget: setDataToWidget
        };
    });
    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs>
                    <Paper className={classes.paper} style={{ padding: 5 }}>
                        {makeContainer({
                            data: clusterCnt[0] ? clusterCnt[0] : 0
                        })}
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper} style={{ padding: 5 }}>
                        {makeContainer({
                            data: clusterCnt[1] ? clusterCnt[1] : 0
                        })}
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper}>xs</Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs>
                    <Paper className={classes.paper}>xs</Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper}>xs</Paper>
                </Grid>
                <Grid item xs>
                    <Paper className={classes.paper}>xs</Paper>
                </Grid>
            </Grid>
        </div>
    );
});

export default CounterWidget;

const makeContainer = info => {
    return (
        <div>
            <CountUp start={0} end={info.data} delay={5} separator={0.1}>
                {({ countUpRef }) => (
                    <div
                        style={{
                            minWidth: 50,
                            minHeight: 30,
                            padding: 2,
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <span>EU</span>
                        <span ref={countUpRef} style={{ fontSize: 16 }} />
                        <span>CloudletName</span>
                    </div>
                )}
            </CountUp>
        </div>
    );
};
