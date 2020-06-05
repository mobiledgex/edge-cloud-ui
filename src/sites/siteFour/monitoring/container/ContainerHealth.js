import React from "react";
import { Grid } from "semantic-ui-react";
// import BasicGauge from "../../../../charts/plotly/BasicGauge";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "../../../../chartGauge/circularProgress";
// import GradientProgress from "../../../../chartGauge/GradientProgress";

const hGap = 20;
const ContainerHealth = defaultProps => {
    const [selfSize, setSelfSize] = React.useState(defaultProps.size);
    const [cpuUsed, setCpuUsed] = React.useState(0);
    const [memoryUsed, setMemoryUsed] = React.useState(0);
    const [diskUsed, setDiskUsed] = React.useState(0);

    const getHeight = () => selfSize.height - hGap;
    React.useEffect(() => {
        console.log("20200601 health data == ", defaultProps);
        setSelfSize(defaultProps.size);
        // setCpuUsed(defaultProps.data.cpuUsed);
        setCpuUsed(87);
        setMemoryUsed(54);
        setDiskUsed(20);
    }, [defaultProps]);

    return (
        <div style={{width:"100%", height:"100%", overflow:'auto'}}>
            <div className='page_monitoring_circle_chart'>
                <div className='page_monitoring_circle_chart_item'>
                    <CircularProgress data={cpuUsed} />
                    <div className='page_monitoring_circle_chart_label'>
                        vCPU
                    </div>
                </div>
                <div className='page_monitoring_circle_chart_item'>
                    <CircularProgress data={memoryUsed} />
                    <div className='page_monitoring_circle_chart_label'>
                        MEM
                    </div>
                </div>
                <div className='page_monitoring_circle_chart_item'>
                    <CircularProgress data={diskUsed} />
                    <div className='page_monitoring_circle_chart_label'>
                        DISK
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ContainerHealth;
