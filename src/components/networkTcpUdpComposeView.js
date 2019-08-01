import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react'
import NetworkInoutLegend from './network/networkInoutLegend';
import TimeSeries from '../charts/plotly/timeseries';
import sizeMe from 'react-sizeme'
import SelectRangeTcpudp from '../components/selectRangeTcpudp';
import NetworkInOutSimple from "../container/developerSideInfo";
import {connect} from "react-redux";
import * as utils from '../utils';
import * as serviceCluster from "../services/service_instance_service";

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
                { key: 'g1', value: '', text: 'neon2' },
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
            timeseriesSeries:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            dataLabel:['TCP conns', 'TCP retransmit'],
            timeseriesDataNET:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesNET:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            dataLabelNet:['UDP send','UDP receive error', 'UDP receive'],
            avgCpu:0.00,
            avgMem:0.00,
            avgNetIn:0.00,
            avgNetOut:0.00,
            applications:[],
            dropdownValueOne:'tdg-barcelona-niantic',
            dropdownValueTwo:null,
        }
        this.selectedCloudlet = 'barcelona-mexdemo';
        this.selectedCluster = 'tdg-barcelona-niantic';
        this.selectedApp = '';
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


    receiveAppCluster(result, self) {

        let tDatas = [[],[]];
        let uDatas = [[],[],[]];
        let series = [];
        let netName = self.state.netName;


        if(result.results) {
            result.results.map((clstData, i) => {
                //console.log('clstdata..', clstData)
                clstData.series.map((data) => {
                    //console.log('data..', data)
                    try{
                        data.values.map((values) => {
                            //console.log('value..', values)
                            if(netName === 'TCP') {
                                tDatas.map((d, j) => {
                                        tDatas[j].push(values[7+j]);
                                        if(j === 0) series.push(values[0])

                                })
                            } else {
                                uDatas.map((d, j) => {

                                        uDatas[j].push(values[9+j]);
                                        if(j === 0) series.push(values[0])

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
        //console.log('t data..',netName, 'data===', sData, series)
        self.setState({timeseriesData:sData,timeseriesSeries:[series], netName:self.state.netName})

    }

    getStatisticsData(self, props) {
        // 클러스터 이름으로 해당 앱의 리소스 정보 - 3Pg 우측상단 Application Statistics
        //if_self.selectedApp !== '') serviceCluster.getAppClusterInfo(this.selectedCluster,this.selectedApp, this.receiveAppCluster);
        if(self.state.dropdownValueTwo !== '') serviceCluster.getTcpUdpClusterInfo(self.selectedCluster,self.state.dropdownValueTwo, self.receiveAppCluster, self);
    }
    setDropdownApp(_applications, _self) {
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
            _self.selectedApp = _optionTwo[0].value
            setTimeout(()=>_self.setState({dropdownValueTwo:_optionTwo[0].value}), 3000)
        }
    }
    componentDidMount() {
        let self = this;
        this.neterval = setInterval(()=> {
            //console.log('re start ==>==>==>', _self.selectedCluster)
            if(self.state.dropdownValueTwo) self.getStatisticsData(self, self.props);
        }, 3000)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
        clearInterval(this.neterval)
        clearTimeout(this.intervalTime);

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

            this.setState({applications:nextProps.applications, netName:nextProps.netName})
        }


        //console.log('===>>>>>>next props cluster app data ..', nextProps.tcpudpClusterData, nextProps.activeIndex, nextProps.netName)
        //TODO:


        this.setDropdownApp(nextProps.applications, this)
    }

    render() {
        const { width, height } = this.props.size
        return (
            <Grid divided='vertically' className='panel_contents' style={{width:width, height:'94%'}}>
                <SelectRangeTcpudp sid='rangeOne' optionOne={this.state.optionOne} optionTwo={this.state.optionTwo} optionThree={this.state.optionThree} optionFour={this.state.optionFour}
                             handleChange={this.handleChange} dropdownValueOne={this.state.dropdownValueOne} dropdownValueTwo={this.state.dropdownValueTwo}/>
                <Grid.Row className='panel_charts'>
                    <Grid.Column>
                        <TimeSeries style={{width:'100%', height:'100%'}} chartData={this.state.timeseriesData} series={this.state.timeseriesSeries} margin={customMargin} marginRight={15}
                                    label={(this.state.netName === 'TCP')?this.state.dataLabel:this.state.dataLabelNet} error={(this.state.netName === 'TCP')?false:true}
                                    showLegend={true} y3Position={0.85}
                                    ></TimeSeries>
                    </Grid.Column>
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
