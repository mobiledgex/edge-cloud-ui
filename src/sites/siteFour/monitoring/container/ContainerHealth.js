import React from "react";
import { Grid } from "semantic-ui-react";
// import BasicGauge from "../../../../charts/plotly/BasicGauge";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "../../../../chartGauge/circularProgress";
import * as dataType from "../formatter/dataType";
// import GradientProgress from "../../../../chartGauge/GradientProgress";

const hGap = 20;
const ContainerHealth = defaultProps => {
    const [data, setData] = React.useState(null);
    const [selfSize, setSelfSize] = React.useState(defaultProps.size);
    const [type, setType] = React.useState('cloudlet');
    const [vCpuMax, setVCpuMax] = React.useState(1);
    const [memoryMax, setMemoryMax] = React.useState(1);
    const [diskMax, setDiskMax] = React.useState(1);
    const [vCpuUsed, setVCpuUsed] = React.useState(0);
    const [memoryUsed, setMemoryUsed] = React.useState(0);
    const [diskUsed, setDiskUsed] = React.useState(0);
    const [vCpuPercent, setVCpuPercent] = React.useState(0);
    const [memoryPercent, setMemoryPercent] = React.useState(0);
    const [diskPercent, setDiskPercent] = React.useState(0);

    const getHeight = () => selfSize.height - hGap;

    React.useEffect(() => {
        setSelfSize(defaultProps.size);
    }, [defaultProps.size]);

    React.useEffect(() => {
        const data = defaultProps.data ? defaultProps.data : { vCpu: null, mem: null, disk: null };
        if (defaultProps.id === dataType.HEALTH_CLUSTER) {
            setType('cluster')

            const cpuPer = Math.round(data.cpu);
            const memoryPer = Math.round(data.mem);
            const diskPer = Math.round(data.disk);
            setVCpuPercent(cpuPer);
            setMemoryPercent(memoryPer);
            setDiskPercent(diskPer);
        } else {
            if (data.vCpu && data.mem && data.disk) {
                setType('cloudlet')

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
        }
    }, [defaultProps.data]);

    return (
        <div style={{ width: "100%", height: "100%", overflow: 'auto' }}>
            <div className='page_monitoring_circle_chart'>
                <div className='page_monitoring_circle_chart_item'>
                    <div className='page_monitoring_circle_chart_label'>
                        {(type === 'cluster')? 'CPU' : 'vCPU'}
                    </div>
                    <CircularProgress data={vCpuPercent} />
                    {(type === 'cloudlet') &&
                    <div className='page_monitoring_circle_chart_text'>
                        {vCpuUsed}{' / '}{vCpuMax}{' Count'}
                    </div>}
                </div>
                <div className='page_monitoring_circle_chart_item'>
                    <div className='page_monitoring_circle_chart_label'>
                        MEM
                    </div>
                    <CircularProgress data={memoryPercent} />
                    {(type === 'cloudlet') &&
                    <div className='page_monitoring_circle_chart_text'>
                        {memoryUsed}{' / '}{memoryMax}{' MBs'}
                    </div>}
                </div>
                <div className='page_monitoring_circle_chart_item'>
                    <div className='page_monitoring_circle_chart_label'>
                        DISK
                    </div>
                    <CircularProgress data={diskPercent} />
                    {(type === 'cloudlet') &&
                    <div className='page_monitoring_circle_chart_text'>
                        {diskUsed}{' / '}{diskMax}{' GBs'}
                    </div>}
                </div>
            </div>
        </div>
    );
};
export default ContainerHealth;
