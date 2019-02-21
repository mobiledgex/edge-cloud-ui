import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react'
import NetworkInoutLegend from './network/networkInoutLegend';
import TimeSeries from '../charts/plotly/timeseries';
import sizeMe from 'react-sizeme'
import SelectRangeTcpudp from '../components/selectRangeTcpudp';
import NetworkInOutSimple from "../container/developerSideInfo";
import {connect} from "react-redux";
import * as utils from '../utils';
import * as serviceCluster from "../services/service_clusters_service";

let customMargin = {
    l: 40,
    r: 20,
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
class NetworkTcpUdpComposeView extends React.Component {
    constructor() {
        super()
        _self = this;
        this.state = {
            optionOne : [
                { key: 'ca', value: 'ca', text: 'Cluster-A' },
                { key: 'cb', value: 'cb', text: 'Cluster-B' },
                { key: 'cc', value: 'cc', text: 'Cluster-C' },
                ],
            optionTwo : [
                { key: 'g1', value: 'neon2-deployment-6885d6b975-hpxdb', text: 'neon2' },
                ],
            optionThree : [
                { key: 'd1', value: 'd1', text: 'CPU/MEM' },
                { key: 'd2', value: 'd2', text: 'NetworkIO' }
                ],
            optionFour : [
                { key: 't1', value: 't1', text: 'Last Hour' },
                { key: 't2', value: 't2', text: 'Last 3 Hours' },
                { key: 't3', value: 't3', text: 'Last 6 Hours' },
                { key: 't4', value: 't4', text: 'Last 12 Hours' },
                { key: 't5', value: 't5', text: 'Last 24 Hours' }
            ],
            timeseriesData:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesCPUMEM:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            dataLabel:['tcpConns', 'tcpRetrans'],
            timeseriesDataNET:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesNET:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            dataLabelNet:['udpSend','udpRecvErr', 'udpRecv'],
            avgCpu:0.00,
            avgMem:0.00,
            avgNetIn:0.00,
            avgNetOut:0.00,
            applications:[],
            dropdownValueOne:'tdg-barcelona-niantic',
            dropdownValueTwo:'neon2-deployment-6885d6b975-hpxdb',
        }
        this.selectedCloudlet = 'barcelona-mexdemo';
        this.selectedCluster = 'tdg-barcelona-niantic';
        this.selectedApp = 'neon2-deployment-6885d6b975-hpxdb';
        this.selectedStatic = '';
        this.selectedPeriod = '';
        this.interval = null;
        this.intervalTime = null;

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
            console.log('option twooooo', _optionTwo)
            _self.setState({optionTwo:_optionTwo})
            _self.setState({dropdownValueTwo:'neon2-deployment-6885d6b975-hpxdb'})

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
        clearTimeout(this.intervalTime);
    }



    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.selectedCluster) {
            this.setState({selectedCluster:nextProps.selectedCluster})
        }
        //
        console.log('receive props..==**', nextProps.applications)
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
        this.intervalTime = setTimeout(() => _self.setDropdownApp(), 2000)

        console.log('===>>>>>>next props cluster app data ..', nextProps.tcpudpClusterData, nextProps.activeIndex, nextProps.netName)
        //TODO:
        let tDatas = [[],[]];
        let uDatas = [[],[],[]];
        let series = [];
        let active = nextProps.activeIndex;
        let netName = nextProps.netName;


        if(nextProps.tcpudpClusterData) {
            nextProps.tcpudpClusterData.map((clstData, i) => {
                console.log('clstdata..', clstData)
                clstData.map((data) => {
                    console.log('data..', data.series)
                    try{
                        data.series.map((values) => {
                            console.log('value..', values)
                            if(netName === 'TCP') {
                                tDatas.map((d, j) => {
                                    values.values.map((vul) => {
                                        tDatas[j].push(vul[7+j]);
                                        if(j === 0) series.push(vul[0])
                                    })
                                })
                            } else {
                                uDatas.map((d, j) => {
                                    values.values.map((vul) => {
                                        uDatas[j].push(vul[9+j]);
                                        if(j === 0) series.push(vul[0])
                                    })
                                })
                            }


                        })
                    }catch(e){
                        console.log('error ----- database not found: clusterstats')
                    }

                })
            })
        }
        let sData = (netName ===  'TCP' || netName === 'tcp') ? tDatas : uDatas;
        console.log('t data..', tDatas, uDatas)
        this.setState({timeseriesData:sData,timeseriesCPUMEM:[series]})

    }

    render() {
        const { width, height } = this.props.size
        return (
            <Grid divided='vertically' className='panel_contents' style={{width:width, height:'87%'}}>
                <SelectRangeTcpudp sid='rangeOne' optionOne={this.state.optionOne} optionTwo={this.state.optionTwo} optionThree={this.state.optionThree} optionFour={this.state.optionFour}
                             handleChange={this.handleChange} dropdownValueOne={this.state.dropdownValueOne} dropdownValueTwo={this.state.dropdownValueTwo}/>
                <Grid.Row className='panel_charts'>
                    <TimeSeries style={{width:'100%', height:'100%'}} chartData={this.state.timeseriesData} series={this.state.timeseriesCPUMEM} margin={customMargin}
                                label={(this.props.netName === 'TCP')?this.state.dataLabel:this.state.dataLabelNet} error={(this.props.netName === 'TCP')?false:true}></TimeSeries>
                </Grid.Row>
            </Grid>
        )
    }
}


const mapStateToProps = (state) => {
                    console.log('state.receiveDataReduce.data-->',state)
    return (state.receiveDataReduce && state.receiveDataReduce.data)?{
        tcpudpClusterData:state.receiveDataReduce.data.tcpudpClusterData
    }:null;
};


export default connect(mapStateToProps, null)(sizeMe({ monitorHeight: true })(NetworkTcpUdpComposeView));
