/**
 * Created by inkikim on 19/12/2018.
 */

import React from 'react'
import { Button, Image, List, Grid } from 'semantic-ui-react'
import * as d3 from 'd3';
import CPUMEMUsage from './cupmemory';
import SparkLine from '../../charts/sparkline';


let listDatas = [
    {alarm:'3', dName:'Cluster-A', values:{cpu:35, mem:55, sys:33}},
    {alarm:'5', dName:'Cluster-B', values:{cpu:78, mem:78, sys:12}},
    {alarm:'1', dName:'Cluster-C', values:{cpu:32, mem:33, sys:67}},
    {alarm:'2', dName:'Cluster-D', values:{cpu:23, mem:46, sys:41}},
    {alarm:'4', dName:'Cluster-E', values:{cpu:55, mem:67, sys:23}}
]
function boxMullerRandom () {
    let phase = false,
        x1, x2, w, z;

    return (function() {

        if (phase = !phase) {
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);

            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            return x1 * w;
        } else {
            return x2 * w;
        }
    })();
}

function randomData(n = 30) {
    return Array.apply(0, Array(n)).map(boxMullerRandom);
}
function getIcon (level, domId) {
    let src;
    switch(level) {
        case '1': src = '/assets/cluster/cluster_level1.svg'; break;
        case '2': src = '/assets/cluster/cluster_level2.svg'; break;
        case '3': src = '/assets/cluster/cluster_level3.svg'; break;
        case '4': src = '/assets/cluster/cluster_level4.svg'; break;
        case '5': src = '/assets/cluster/cluster_level5.svg'; break;
        default: src = '/assets/cluster/cluster_level1.svg'; break;
    }
    // 오류나서 잠시 막음
    // d3.svg(src).then((svg) => {
    //     const gElement = d3.select(svg).select('svg');
    //     d3.select(domId).node().append(gElement.node());
    // })
}
const sampleData = randomData(30);
const sampleData100 = randomData(100);

const getRow = (idx, level, dName, uValues, spkDatas) => (
    <Grid.Row key={idx} columns={3} className='cluster_property'>
        <Grid.Column width={3} className='cluster_health'>
            <div id={"icon_"+idx} className='cluster_icon'>
                {getIcon(level, '#icon_'+idx)}
            </div>
            <div className='label'>{dName}</div>
        </Grid.Column>
        <Grid.Column width={7} style={{display:'flex', justifyContent:'space-between'}}>
            <CPUMEMUsage label="CPU" value={uValues.cpu} w={60} h={60}></CPUMEMUsage>
            <CPUMEMUsage label="MEMORY" value={uValues.mem} w={60} h={60}></CPUMEMUsage>
            <CPUMEMUsage label="SYSTEM" value={uValues.sys} w={60} h={60}></CPUMEMUsage>
        </Grid.Column>
        <Grid.Column width={6} style={{display:'flex', justifyContent:'center', padding:0, margin:0}}>
            <div className='spark_chart'>
                <SparkLine sId={'spchart_'+idx} w={200} h={60}></SparkLine>
                <div className='label'>NETWORK I/O</div>
            </div>
        </Grid.Column>
    </Grid.Row>
)

const CPUMEMListView = () => (
    <Grid divided size="small" className='panel_contents'>
        {listDatas.map((data, i) => getRow(i, data.alarm, data.dName, data.values, sampleData))}
    </Grid>
)

export default CPUMEMListView




