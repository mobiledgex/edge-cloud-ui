/**
 * Created by inkikim on 19/12/2018.
 */

import React from 'react'
import { Button, Image, List, Grid } from 'semantic-ui-react'
import * as d3 from 'd3';
import CPUMEMUsage from './cupmemory';
import SparkLine from '../../charts/sparkline';
import ClusterIcon from '../../components/icon/clusterIcon';


let listData = [
    {alarm:'3', dName:'Cluster-A', values:{cpu:35, mem:55, sys:33}},
    {alarm:'5', dName:'Cluster-B', values:{cpu:78, mem:78, sys:12}},
    {alarm:'1', dName:'Cluster-C', values:{cpu:32, mem:33, sys:67}},
    {alarm:'2', dName:'Cluster-D', values:{cpu:23, mem:46, sys:41}},
    {alarm:'4', dName:'Cluster-E', values:{cpu:55, mem:67, sys:23}}
]
let icnt = 0;
let domId_old = null;
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

const sampleData = randomData(30);
const sampleData100 = randomData(100);

const testColor = ['yellow', 'green', 'blue', 'grey', 'sky']
const getRow = (idx, uValues, clusterNm, state) => (
    <Grid.Row key={idx} columns={3} className='cluster_property'>
        <Grid.Column width={4} className='cluster_health'>
            <ClusterIcon idx={idx} uValues={uValues['cpu']}></ClusterIcon>
            <div className='label'>{clusterNm}</div>
        </Grid.Column>
        <Grid.Column width={7} style={{display:'flex', justifyContent:'space-between'}}>
            <CPUMEMUsage label="CPU" value={uValues.cpu} w={60} h={60}></CPUMEMUsage>
            <CPUMEMUsage label="MEMORY" value={uValues.mem} w={60} h={60}></CPUMEMUsage>
            <CPUMEMUsage label="DISK" value={uValues.sys} w={60} h={60}></CPUMEMUsage>
        </Grid.Column>
        <Grid.Column width={5} style={{display:'flex', justifyContent:'center'}}>
            <div className='transition_chart'>
                <SparkLine sId={'spchart_'+idx} w={240} h={60} value={{IN:uValues.net[0], OUT:uValues.net[1]}} label={['recvBytes','sendBytes']} series={uValues.time}></SparkLine>
                <div className='label'>NETWORK I/O</div>
            </div>
        </Grid.Column>
    </Grid.Row>
)

class CPUMEMListView extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            listCluster:['ClusterA', 'ClusterB', 'ClusterC', 'ClusterD', 'ClusterE'],
            listData:[]
        }
        this.count = 0;
    }

    componentDidMount() {
        let idx = 0;
        this.state.listCluster.map((clst, i) => {
            //getIcon('#icon_'+i, 2);
        })
        this.setState({listCluster: this.props.clusters})

    }
    componentWillReceiveProps(nextProps, nextContext) {

        let list = [];
        this.state.listCluster.map((cluster, i) => {
            nextProps.listData.map((data) => {
                if(data.dName === cluster){
                    //It's too long name of cluster, so that cut operator name....
                    //data.dName = data.dName.replace(nextProps.cloudlets[i], '')
                    list[i] = data;
                }
            })
        })
        //순서 고정하기
        this.setState({listData:list})

    }

    render() {
        return (
            <Grid divided size="small" className='panel_contents'>
                {this.state.listData.map((data, i) =>
                    getRow(i, data.values, data.dName, this.state)
                )}
            </Grid>
        )
    }

}

export default CPUMEMListView




