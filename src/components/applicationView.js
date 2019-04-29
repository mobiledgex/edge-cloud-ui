import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react'
import sizeMe from 'react-sizeme'
import NetworkInoutLegend from './network/networkInoutLegend';
import TimeSeries from '../charts/plotly/timeseries';
import * as serviceCluster from '../services/service_clusters_service';
import {connect} from "react-redux";
import * as utils from '../utils';
import SelectRange from '../components/selectRange';
import * as d3 from 'd3';

let customMargin = {
    l: 50,
    r: 15,
    b: 35,
    t: 5,
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
            dataLabel:['CPU', 'MEM'],
            timeseriesDataNET:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesNET:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            dataLabelNet:['RCV', 'SND'],
            avgCpu:0.00,
            avgMem:0.00,
            avgNetIn:0.00,
            avgNetOut:0.00,
            applications:[],
            dropdownValueOne:'tdg-barcelona-niantic',
            dropdownValueTwo:'',
            dropdownValueCluster:'',
            dropdownValueApp:''

        }
        this.selectedCloudlet = 'barcelona-mexdemo';
        this.selectedCluster = 'tdg-barcelona-niantic';
        this.selectedApp = '';
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


    /*
    Starting number: 1500

d3.format(",") : 1,500

d3.format(".1f") : 1500.0

d3.format(",.2f") : 1,500.00

d3.format("s") : 1.5k

d3.format(".1s") : 2k

d3.format(".2s") : 1.5k

function(d) { return "$" + d3.format(",.2f")(d); } : $1,500.00

d3.format(",.2%") : 150,000.00%
    */
    receiveAppCluster(result, self) {

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

        let kbFormat = d3.format('.2s')
        console.log('result app cluster.........>>', result)
        if(result){
            try {
                result.map((data) => {
                    data.series.map((item, i) => {
                        newData[0] = item.values.map((value) => (
                            Number(value[3])*5
                        ))
                        newData[1] = item.values.map((value) => (
                            Number(value[5])
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

                avgCpu = newData[0][newData[0].length-1];
                avgMem = newData[1][newData[1].length-1];
                avgNetIn = newData2[0][newData2[0].length-1];
                avgNetOut = newData2[1][newData2[0].length-1];

                // avgCpu = (newData[0].length > 4)?newData[0][newData[0].length-1].toFixed(4):newData[0][newData[0].length-1];
                // avgMem = (newData[1].length > 4)?newData[1][newData[0].length-1].toFixed(4):newData[1][newData[1].length-1];
                // avgNetIn = (newData2[0].length > 4)?newData2[0][newData2[0].length-1].toFixed(4):newData2[0][newData2[0].length-1];
                // avgNetOut = (newData2[1].length > 4)?newData2[1][newData2[1].length-1].toFixed(4):newData2[1][newData2[1].length-1];1

                //console.log('avgs ==> ==> ', avgCpu, d3.format("s")(avgMem))
                self.setState({timeseriesDataCPUMEM:newData, timeseriesCPUMEM:newseries,timeseriesDataNET:newData2, timeseriesNET:newseries,
                    avgCpu:(avgCpu*5).toFixed(4), avgMem:d3.format(".2s")(avgMem), avgNetIn:d3.format(".2s")(avgNetIn), avgNetOut:d3.format(".2s")(avgNetOut)
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

    getStatisticsData(self) {
        // 클러스터 이름으로 해당 앱의 리소스 정보 - 3Pg 우측상단 Application Statistics
        //console.log('request data params =-=-=', this.selectedCluster, this.selectedApp)
        if(self.state.dropdownValueTwo !== '') serviceCluster.getAppClusterInfo(self.selectedCluster,self.state.dropdownValueTwo, self.receiveAppCluster, self);
    }
    setDropdownApp(_applications) {
        // 클러스터 / 어플리케이션
        let _optionTwo = [];
        if(_applications) {
            _applications.map((cld, i) => {
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
                        }
                    })
                }
            })

            _self.setState({optionTwo:_optionTwo})
            this.selectedApp = _optionTwo[0].value
            setTimeout(()=>_self.setState({dropdownValueTwo:_optionTwo[0].value}), 3000)
        }
    }
    componentDidMount() {
        let self = this;
        this.neterval = setInterval(()=> {
            //console.log('re start ==>==>==>', _self.selectedCluster)
            self.getStatisticsData(self);
        }, 3000)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
        clearInterval(this.neterval)
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
        this.setDropdownApp(nextProps.applications)

    }


    render() {
        const { width, height } = this.props.size
        return (
            <Grid divided='vertically' className='panel_contents' style={{height:'97%'}}>

                <SelectRange sid='rangeOne' optionOne={this.state.optionOne} optionTwo={this.state.optionTwo} optionThree={this.state.optionThree} optionFour={this.state.optionFour}
                             handleChange={this.handleChange} dropdownValueOne={this.state.dropdownValueOne} dropdownValueTwo={this.state.dropdownValueTwo}/>
                <Grid.Row columns={2} className='panel_charts' style={{height:'40%'}}>
                    <Grid.Column width={12}>
                        {/*<BBLineChart chartId='cpumem' w={width*(12/16)} h={height*0.35} chartData={this.state.timeseriesDataCPUMEM} series={[]}/>*/}
                        <TimeSeries style={{width:'100%', height:'100%'}} chartData={this.state.timeseriesDataCPUMEM} series={this.state.timeseriesCPUMEM} margin={customMargin} label={this.state.dataLabel} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row>
                            <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']} title="CPU"  unit="%" chartId='cpuAvg' value={this.state.avgCpu}></NetworkInoutLegend>
                            <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']} title="MEMORY" unit="B" chartId='memAvg' value={this.state.avgMem}></NetworkInoutLegend>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
                <div className='panel_line_h'/>
                <SelectRange sid='rangeTwo' optionOne={this.state.optionOne} optionTwo={this.state.optionTwo} optionThree={this.state.optionThree} optionFour={this.state.optionFour}
                             handleChange={this.handleChange} dropdownValueOne={this.state.dropdownValueOne}  dropdownValueTwo={this.state.dropdownValueTwo}/>
                <Grid.Row columns={2} className='panel_charts' style={{height:'40%'}}>

                    <Grid.Column width={12}>
                        <TimeSeries style={{width:'100%', height:'100%'}} chartData={this.state.timeseriesDataNET} series={this.state.timeseriesNET} margin={customMargin} label={this.state.dataLabelNet} yRange={[0.001, 0.009]}></TimeSeries>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row>
                            <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']} title="Network RCV" value={this.state.avgNetIn} unit="B"></NetworkInoutLegend>
                            <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']} title="Network SND" value={this.state.avgNetOut} unit="B"></NetworkInoutLegend>
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
