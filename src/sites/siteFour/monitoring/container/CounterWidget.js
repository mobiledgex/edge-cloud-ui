import React, {
    useState, forwardRef, useImperativeHandle, useEffect
} from "react";
import CountUp from "react-countup";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import isEqual from "lodash/isEqual";
import { dataFormatCountCluster } from "../formatter/dataFormats";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            height:'100%',
        },
        grid: {
            height: '100%',
            margin: '0 -4px'
        },
        layout: {
            height: '50%',
            maxHeight: '50%',
            minHeight: '50%'
        },
        item: {
            backgroundColor: "#1e2124",
            padding:3,
            width:'100%',
            height:'100%',

        },
        paper: {
            padding: theme.spacing(2),
            textAlign: "center",
            color: theme.palette.text.secondary
        }
    })
);
const CounterWidget = forwardRef((props, ref) => {
    const [clusterCnt, setClusterCnt] = useState(props);
    const [clusterList, setClusterList] = useState([]);
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
            setClusterList(containerData);
            setTimeout(() => setInitial(false), 500);
        }
        setData(props.data);
    }, [props]);

    let index = [0,1,2,3,4,5]

    return (
        <div className={classes.root}>
            <Grid className={classes.grid} container spacing={1}>
                {index.map( i => (
                    <Grid className={classes.layout} item xs={4}>
                        <div className={classes.item}>
                            {makeContainer(clusterCnt, (step * gridCnt) + i, step)}
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
});

export default CounterWidget;

const makeContainer = (clusterData, index, step) => (
    <div style={{ width: "100%", height: "100%" }}>
        {(clusterData[index])
            ? (
                <div className='page_monitoring_cnt_box'

                >
                    <div className='page_monitoring_cnt_region'>{clusterData[index].region}</div>
                    <div className='page_monitoring_cnt_name'>{clusterData[index].cloudlet}</div>
                    <div className='page_monitoring_cnt_num'>
                        <CountUp isCounting end={clusterData[index].count} duration={3.2} />
                    </div>
                </div>
            ) : null}
    </div>
);
