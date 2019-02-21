import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react'
import sizeMe from 'react-sizeme'
import NetworkInoutLegend from './network/networkInoutLegend';
import TimeSeriesFlow from '../charts/plotly/timeseriesFlow';
import * as serviceCluster from '../services/service_clusters_service';
import {connect} from "react-redux";
import * as utils from '../utils';
import SelectRange from '../components/selectRange';

let customMargin = {
    l: 40,
    r: 20,
    b: 35,
    t: 2,
    pad: 0
}
var data = [
    {
        x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
        y: [1, 3, 6],
        type: 'scatter'
    }
];
let _self = null;
class ApplicationView extends React.Component {
    constructor() {
        super();
        _self = this;
        this.state = {
            optionOne : [
                { key: 'ca', value: 'ca', text: 'Select Cluster' },
                { key: 'cb', value: 'cb', text: 'Cluster-B' },
                { key: 'cc', value: 'cc', text: 'Cluster-C' },
                ],
            optionTwo : [
                { key: 'g1', value: 'g1', text: 'PokemonGo' },
                { key: 'g2', value: 'g2', text: 'Game2' },
                { key: 'g3', value: 'g3', text: 'Game3' }
                ],
            optionThree : [
                { key: 'd1', value: 'd1', text: 'CPU/MEM' },
                { key: 'd2', value: 'd2', text: 'Network I/O' }
                ],
            optionFour : [
                { key: 't1', value: 't1', text: 'Last Hour' },
                { key: 't2', value: 't2', text: 'Last 3 Hours' },
                { key: 't3', value: 't3', text: 'Last 6 Hours' },
                { key: 't4', value: 't4', text: 'Last 12 Hours' },
                { key: 't5', value: 't5', text: 'Last 24 Hours' }
            ],
            timeseriesDataCPUMEM:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesCPUMEM:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            dataLabel:['cpu', 'mem'],
            timeseriesDataNET:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesNET:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            dataLabelNet:['REV', 'SND'],
            avgCpu:0.00,
            avgMem:0.00,
            avgNetIn:0.00,
            avgNetOut:0.00,
            applications:[],
            dropdownValueOne:'tdg-barcelona-niantic',
            dropdownValueTwo:'neon2-deployment-6885d6b975-hpxdb',
            dropdownValueCluster:'',
            dropdownValueApp:''

        }
        this.selectedCloudlet = 'barcelona-mexdemo';
        this.selectedCluster = 'tdg-barcelona-niantic';
        this.selectedApp = 'neon2-deployment-6885d6b975-hpxdb';
        this.selectedStatic = '';
        this.selectedPeriod = '';
        this.interval = null;

    }

    handleChange(obj) {
        console.log('**************************')
        console.log('obj. ', obj.id, obj.key, obj.value, obj.key.indexOf('0'))
        console.log('**************************')
        if(obj.key.indexOf('0')>-1){
            _self.selectedCluster = obj.value;
            _self.setState({dropdownValueOne:obj.value})

        }
    }


    receiveAppCluster(result) {

        let resultArray = result;
        //_self.props.handleInjectData({appClusterData:resultArray})
        let newData = [[2,3,4,2,3,4],[6,5,6,5,6,7]];
        let newData2 = [[2,3,4,2,3,4],[6,5,6,5,6,7]];
        let newseries = [[0,1,2,3,4,5]];
        let newseries2 = [[0,1,2,3,4,5]];
        let avgCpu = 0.00;
        let avgMem = 0.00;
        let avgNetIn = 0.00;
        let avgNetOut = 0.00;
        if(result){
            try {
                result.map((data) => {
                    data.series.map((item, i) => {
                        newData[0] = item.values.map((value) => (
                            Number(value[3]).toFixed(6) * 1000
                        ))
                        newData[1] = item.values.map((value) => (
                            Number(value[5]) * 0.0000000001
                        ))
                        newseries[0] = item.values.map((value) => (
                            value[0]
                        ))

                        newData2[0] = item.values.map((value) => (
                            Number(value[6])
                        ))
                        newData2[1] = item.values.map((value) => (
                            Number(value[7])
                        ))

                    })
                })

                avgCpu = utils.avg(newData[0]).toFixed(4);
                avgMem = utils.avg(newData[1]).toFixed(4);
                avgNetIn = utils.avg(newData2[0]);
                avgNetOut = utils.avg(newData2[1]);

                //console.log('avgs ==> ==> ', avgCpu, avgMem)
                _self.setState({timeseriesDataCPUMEM:newData, timeseriesCPUMEM:newseries,timeseriesDataNET:newData2, timeseriesNET:newseries,
                    avgCpu:Number(avgCpu), avgMem:Number(avgMem), avgNetIn:Number(avgNetIn), avgNetOut:Number(avgNetOut)
                })
            }catch(e){
                console.log('error',e)
            }

            // if(nextProps.listCluster) {
            //     let item = {};
            //     let clusters = [];
            //     nextProps.listCluster.map((clst) => {
            //
            //     })
            // }

        }
    }

    getStatisticsData() {
        // 클러스터 이름으로 해당 앱의 리소스 정보 - 3Pg 우측상단 Application Statistics
        //console.log('request data params =-=-=', this.selectedCluster, this.selectedApp)
        if(this.selectedApp !== '') serviceCluster.getAppClusterInfo(this.selectedCluster,this.selectedApp, this.receiveAppCluster);
    }
    setDropdownApp() {
        // 클러스터 / 어플리케이션
        let _optionTwo = [];
        if(_self.state.applications) {
            _self.state.applications.map((cld, i) => {
                if(cld.cloudlet === _self.selectedCloudlet) {
                    cld.clusters.map((clst, j) => {
                        if(clst.cluster === _self.selectedCluster) {
                            clst.shortApps.map((app, i) => {
                                let itemOne = { key: '', value: '', text: '' };
                                itemOne.key = app;
                                itemOne.value = clst.apps[i];
                                itemOne.text = app;
                                _optionTwo.push(itemOne);
                            })

                            //_self.setState({dropdownValueTwo:clst.apps[0]})

                        }
                    })
                }
            })

            _self.setState({optionTwo:_optionTwo})
            setTimeout(()=>_self.setState({dropdownValueTwo:'neon2-deployment-6885d6b975-hpxdb'}), 3000)

        }
    }
    componentDidMount() {

        this.neterval = setInterval(()=> {
            //console.log('re start ==>==>==>', _self.selectedCluster)
            _self.getStatisticsData();
        }, 3000)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.selectedCluster) {
            this.setState({selectedCluster:nextProps.selectedCluster})
        }
        //
        let _optionOne = [];
        // 클러스터 리스트
        if(nextProps.applications) {
            nextProps.applications.map((cld, i) => {
                if(cld.cloudlet === this.selectedCloudlet) {
                    cld.clusters.map((clst, j) => {
                        let itemOne = { key: '', value: '', text: '' };
                        itemOne.key = clst.cluster;
                        itemOne.value = clst.cluster;
                        itemOne.text = clst.cluster;
                        _optionOne.push(itemOne);
                        //this.selectedApp = clst.apps[0];
                    })
                    //this.selectedCluster = cld.clusters[0].cluster; // default cluster
                    //this.setState({dropdownValueOne:cld.clusters[0].cluster})
                }
            })
            this.setState({optionOne:_optionOne})

            this.setState({applications:nextProps.applications})
        }
        this.setDropdownApp()

    }


    render() {
        const { width, height } = this.props.size
        return (
            <Grid divided='vertically' className='panel_contents'>

                <SelectRange sid='rangeOne' optionOne={this.state.optionOne} optionTwo={this.state.optionTwo} optionThree={this.state.optionThree} optionFour={this.state.optionFour}
                             handleChange={this.handleChange} dropdownValueOne={this.state.dropdownValueOne} dropdownValueTwo={this.state.dropdownValueTwo}/>
                <Grid.Row columns={2} className='panel_charts' style={{height:'215px'}}>

                    <Grid.Column width={12}>
                        {/*<BBLineChart chartId='cpumem' w={width*(12/16)} h={height*0.35} chartData={this.state.timeseriesDataCPUMEM} series={[]}/>*/}
                        <TimeSeriesFlow style={{width:'100%', height:'100%'}} chartData={this.state.timeseriesDataCPUMEM} series={this.state.timeseriesCPUMEM} margin={customMargin} label={this.state.dataLabel}></TimeSeriesFlow>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row>
                            <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']} title="CPU(Average)"  unit="%" chartId='cpuAvg' value={this.state.avgCpu}></NetworkInoutLegend>
                            <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']} title="MEMORY(Average)" unit="%" chartId='memAvg' value={this.state.avgMem}></NetworkInoutLegend>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
                <div className='panel_line_h'/>
                <SelectRange sid='rangeTwo' optionOne={this.state.optionOne} optionTwo={this.state.optionTwo} optionThree={this.state.optionThree} optionFour={this.state.optionFour}
                             handleChange={this.handleChange} dropdownValueOne={this.state.dropdownValueOne}  dropdownValueTwo={this.state.dropdownValueTwo}/>
                <Grid.Row columns={2} className='panel_charts' style={{height:'215px'}}>

                    <Grid.Column width={12}>
                        <TimeSeriesFlow style={{width:'100%', height:'100%'}} chartData={this.state.timeseriesDataNET} series={this.state.timeseriesNET} margin={customMargin} label={this.state.dataLabelNet}></TimeSeriesFlow>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row>
                            <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']} title="Network In" value={this.state.avgNetIn} unit="MB"></NetworkInoutLegend>
                            <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']} title="Network Out" value={this.state.avgNetOut} unit="MB"></NetworkInoutLegend>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}


const mapStateToProps = (state) => {
    return (state.receiveDataReduce && state.receiveDataReduce.data)?{
        appClusterData:state.receiveDataReduce.data.appClusterData,

    }:null;
};


export default connect(mapStateToProps, null)(sizeMe({ monitorHeight: true })(ApplicationView));
