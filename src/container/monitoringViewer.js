import React from 'react';
import { Grid, Header, Segment, Container } from "semantic-ui-react";
import TimeSeries from '../charts/plotly/timeseries';
import * as d3 from 'd3';
import './styles.css'

export default class MonitoringViewer extends React.Component {
    state = {
        mProp : {
            timeseriesDataCPUMEM:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesCPUMEM:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],

            timeseriesDataNET:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesNET:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            timeseriesDataTCP:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesTCP:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            timeseriesDataUDP:[
                [0,1,2,3,4,5],[2,3,4,5,6,7],[2,3,4,5,6,7]
            ],
            timeseriesUDP:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            dataLabel:['CPU', 'MEM'],
            dataLabelNET:['RCV', 'SND'],
            dataLabelTCP:['RCV', 'SND'],
            dataLabelUDP:['RCV', 'SND', 'ERROR'],
        },
        lastCPU:0, lastMEM: 0, lastNET:[], lastUDP:[], lastTCP:[],
        data:[]
    }

    cpuCnt = 0;
    memCnt = 0;
    netCnt = 0;
    tcpCnt = 0;
    udpCnt = 0;

    setTimeseriesDataCPUMEM (label, values) {
        if(label === 'cpu') {
            this.state.mProp['timeseriesDataCPUMEM'][0][this.cpuCnt] = parseFloat(values['cmsn']).toFixed(2);
            this.state.mProp['timeseriesCPUMEM'][0][this.cpuCnt] = values['time'];
            this.cpuCnt ++;
        }
        if(label === 'mem') {
            this.state.mProp['timeseriesDataCPUMEM'][1][this.memCnt] = values['cmsn'];
            this.memCnt ++;
        }
        if(label === 'network') {
            this.state.mProp['timeseriesDataNET'][0][this.netCnt] = values['cmsn'][0];
            this.state.mProp['timeseriesDataNET'][1][this.netCnt] = values['cmsn'][1];
            this.state.mProp['timeseriesNET'][0][this.netCnt] = values['time'];
            this.netCnt ++;
        }
        if(label === 'tcp') {
            this.state.mProp['timeseriesDataTCP'][0][this.tcpCnt] = values['cmsn'][0];
            this.state.mProp['timeseriesDataTCP'][1][this.tcpCnt] = values['cmsn'][1];
            this.state.mProp['timeseriesTCP'][0][this.tcpCnt] = values['time'];
            this.tcpCnt ++;
        }
        if(label === 'udp') {
            this.state.mProp['timeseriesDataUDP'][0][this.udpCnt] = values['cmsn'][0];
            this.state.mProp['timeseriesDataUDP'][1][this.udpCnt] = values['cmsn'][1];
            this.state.mProp['timeseriesDataUDP'][2][this.udpCnt] = values['cmsn'][2];
            this.state.mProp['timeseriesUDP'][0][this.udpCnt] = values['time'];
            this.udpCnt ++;
        }
        console.log('20190730 ...last last ...', this.state.mProp['timeseriesDataNET'], " -:- ", this.netCnt)
        this.setState({props: this.state.mProp})
        this.setState({lastCPU: this.state.mProp['timeseriesDataCPUMEM'][0][this.cpuCnt-1]})
        this.setState({lastMEM: this.state.mProp['timeseriesDataCPUMEM'][1][this.memCnt-1]})
        this.setState({lastNET: [this.state.mProp['timeseriesDataNET'][0][this.netCnt-1], this.state.mProp['timeseriesDataNET'][1][this.netCnt-1] ]})
        this.setState({lastTCP: [this.state.mProp['timeseriesDataTCP'][0][this.tcpCnt-1], this.state.mProp['timeseriesDataTCP'][1][this.tcpCnt-1] ]})
        this.setState({lastUDP: [this.state.mProp['timeseriesDataUDP'][0][this.udpCnt-1], this.state.mProp['timeseriesDataUDP'][1][this.udpCnt-1] ]})
    }
    bytesToString =  (bytes) => {
        // One way to write it, not the prettiest way to write it.

        var fmt = d3.format('.0f');
        if (bytes < 1024) {
            return fmt(bytes) + ' B';
        } else if (bytes < 1024 * 1024) {
            return fmt(bytes / 1024) + ' kB';
        } else if (bytes < 1024 * 1024 * 1024) {
            return fmt(bytes / 1024 / 1024) + ' MB';
        } else {
            return fmt(bytes / 1024 / 1024 / 1024) + ' GB';
        }
    }
    feedData(data) {
        this.cpuCnt = 0;
        this.memCnt = 0;
        this.netCnt = 0;
        this.tcpCnt = 0;
        this.udpCnt = 0;
        if(data) {
            data.mData.map(item => {
                console.log('20190730 ...monitoring viewer did Mount ...', item)
                if(item.name.indexOf('cpu') > -1) {
                    this.setTimeseriesDataCPUMEM('cpu',item['values'])
                } else if(item.name.indexOf('mem') > -1) {
                    this.setTimeseriesDataCPUMEM('mem',item['values'])
                } else if(item.name.indexOf('network') > -1) {
                    this.setTimeseriesDataCPUMEM('network',item['values'])
                } else if(item.name.indexOf('tcp') > -1) {
                    this.setTimeseriesDataCPUMEM('tcp',item['values'])
                } else if(item.name.indexOf('udp') > -1) {
                    this.setTimeseriesDataCPUMEM('udp',item['values'])
                }
            })
        }
    }

    componentDidMount() {
        console.log('20190730 ...monitoring viewer. ', this.props)
        if(this.props.data) {
            this.setState({data:this.props.data})
            this.feedData(this.props.data)
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('20190730 ...monitoring viewer...next nextprops......', nextProps)
        this.feedData(nextProps.data);
    }

    render() {
        return (
            <Grid.Row style={{height:700, backgroundColor:'#252525'}}>
                <Grid.Column>
                    <div className='wrapperPercentage'>
                        <Segment className="childPercentage" inverted color='red'>
                            <Header>
                                CPU
                            </Header>
                            <Container>{this.state.lastCPU + '%'}</Container>
                        </Segment>
                        <Segment className="childPercentage" inverted color='orange'>
                            <Header>
                                MEMORY
                            </Header>
                            <Container>{this.bytesToString(this.state.lastMEM)}</Container>
                        </Segment>
                        <Segment className="childPercentage" inverted color='yellow'>
                            <Header>
                                NETWORK
                            </Header>
                            <Container>{JSON.stringify(this.state.lastNET)}</Container>
                        </Segment>
                        {
                            (this.props.data.page !== 'appInst')?
                                <Segment className="childPercentage" inverted color='olive'>
                                    <Header>
                                        TCP
                                    </Header>
                                    <Container>{JSON.stringify(this.state.lastTCP)}</Container>
                                </Segment>
                            :
                            null
                        }
                        {
                            (this.props.data.page !== 'appInst')?
                                <Segment className="childPercentage" inverted color='green'>
                                    <Header>
                                        UDP
                                    </Header>
                                    <Container>{JSON.stringify(this.state.lastUDP)}</Container>
                                </Segment>
                            :
                            null
                        }

                    </div>
                </Grid.Column>
                <Grid.Column style={{height:400}}>
                    <Header>CPU & MEMORY</Header>
                    <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataCPUMEM} series={this.state.mProp.timeseriesCPUMEM} margin={10} label={this.state.mProp.dataLabel} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                    <Header>NETWORK</Header>
                    <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataNET} series={this.state.mProp.timeseriesNET} margin={10} label={this.state.mProp.dataLabelNET} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                    {
                        (this.props.data.page !== 'appInst')?
                            <div style={{height:500}}>
                                <Header>TCP</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataTCP} series={this.state.mProp.timeseriesTCP} margin={10} label={this.state.mProp.dataLabelTCP} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                                :
                            null
                    }
                    {
                        (this.props.data.page !== 'appInst')?
                            <div style={{height:500}}>
                                <Header>UDP</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataUDP} series={this.state.mProp.timeseriesUDP} margin={10} label={this.state.mProp.dataLabelUDP} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                                :
                            null
                    }


                </Grid.Column>
            </Grid.Row>
        )
    }
}
