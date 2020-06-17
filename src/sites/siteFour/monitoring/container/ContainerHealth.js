import React from "react";
import { Grid } from "semantic-ui-react";
// import BasicGauge from "../../../../charts/plotly/BasicGauge";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "../../../../chartGauge/circularProgress";
// import GradientProgress from "../../../../chartGauge/GradientProgress";

const hGap = 20;
const ContainerHealth = defaultProps => {
    const [data, setData] = React.useState(null);
    const [selfSize, setSelfSize] = React.useState(defaultProps.size);
    const [vCpuMax, setVCpuMax] = React.useState(1);
    const [memoryMax, setMemoryMax] = React.useState(1);
    const [diskMax, setDiskMax] = React.useState(1);
    const [vCpuUsed, setVCpuUsed] = React.useState(1);
    const [memoryUsed, setMemoryUsed] = React.useState(1);
    const [diskUsed, setDiskUsed] = React.useState(1);
    const [vCpuPercent, setVCpuPercent] = React.useState(1);
    const [memoryPercent, setMemoryPercent] = React.useState(1);
    const [diskPercent, setDiskPercent] = React.useState(1);

    const getHeight = () => selfSize.height - hGap;

    React.useEffect(() => {
        setSelfSize(defaultProps.size);
    }, [defaultProps.size]);

    React.useEffect(() => {
        const data = defaultProps.data ? defaultProps.data : { vCpu: null, mem: null, disk: null };
        if (data.vCpu && data.mem && data.disk) {
            const vCpu = data.vCpu;
            setVCpuMax(vCpu.max);
            setVCpuUsed(vCpu.current);
            const vCpuPer = Math.round(vCpu.current / vCpu.max * 100);
            setVCpuPercent(vCpuPer);

            const memory = data.mem;
            setMemoryMax(memory.max);
            setMemoryUsed(memory.current);
            const memoryPer = Math.round(memory.current / memory.max * 100);
            setMemoryPercent(memoryPer);

            const disk = data.disk;
            setDiskMax(disk.max);
            setDiskUsed(disk.current);
            const diskPer = Math.round(disk.current / disk.max * 100);
            setDiskPercent(diskPer);
        }

    }, [defaultProps.data]);

    return (
        <div style={{ width: "100%", height: "100%", overflow: 'auto' }}>
            <div className='page_monitoring_circle_chart'>
                <div className='page_monitoring_circle_chart_item'>
                    <div className='page_monitoring_circle_chart_label'>
                        vCPU
                    </div>
                    <CircularProgress data={vCpuPercent} />
                    <div className='page_monitoring_circle_chart_text'>
                        {vCpuUsed}{' / '}{vCpuMax}{' Count'}
                    </div>
                </div>
                <div className='page_monitoring_circle_chart_item'>
                    <div className='page_monitoring_circle_chart_label'>
                        MEM
                    </div>
                    <CircularProgress data={memoryPercent} />
                    <div className='page_monitoring_circle_chart_text'>
                        {memoryUsed}{' / '}{memoryMax}{' MBs'}
                    </div>
                </div>
                <div className='page_monitoring_circle_chart_item'>
                    <div className='page_monitoring_circle_chart_label'>
                        DISK
                    </div>
                    <CircularProgress data={diskPercent} />
                    <div className='page_monitoring_circle_chart_text'>
                        {diskUsed}{' / '}{diskMax}{' GBs'}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ContainerHealth;
