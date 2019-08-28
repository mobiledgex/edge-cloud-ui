import React from 'react';
import { Grid, Header, Segment, Container } from "semantic-ui-react";
import TimeSeries from '../charts/plotly/timeseries';
import * as d3 from 'd3';
import './styles.css'

export default class MonitoringViewer extends React.Component {
    state = {
        mProp : {
            timeseriesDataCPUMEM:[
                [],[]
            ],
            timeseriesCPUMEM:[
                []
            ],

            timeseriesDataNET:[
                [],[]
            ],
            timeseriesNET:[
                []
            ],
            timeseriesDataDISK:[
                []
            ],
            timeseriesDISK:[
                []
            ],
            timeseriesDataTCP:[
                [],[]
            ],
            timeseriesTCP:[
                []
            ],
            timeseriesDataUDP:[
                [],[],[]
            ],
            timeseriesUDP:[
                []
            ],
            dataLabel:['CPU', 'MEM'],
            dataLabelNET:['RCV', 'SND'],
            dataLabelDISK:['DISK'],
            dataLabelTCP:['RCV', 'SND'],
            dataLabelUDP:['RCV', 'SND', 'ERROR'],
        },
        lastCPU:0, lastMEM: 0, lastNET:[0,0], lastUDP:[0,0], lastTCP:[0,0],
        data:[]
    }

    cpuCnt = 0;
    memCnt = 0;
    netCnt = 0;
    diskCnt = 0;
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
        if(label === 'disk') {
            this.state.mProp['timeseriesDataDISK'][0][this.diskCnt] = parseFloat(values['cmsn']).toFixed(2);
            this.state.mProp['timeseriesDISK'][0][this.diskCnt] = values['time'];
            this.diskCnt ++;
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
        //console.log('20190812 lastMem..',this.state.mProp['timeseriesDataCPUMEM'],":",this.state.mProp['timeseriesDataCPUMEM'][1][this.memCnt-1])
        this.setState({props: this.state.mProp})
        this.setState({lastCPU: this.state.mProp['timeseriesDataCPUMEM'][0][this.cpuCnt-1]})
        this.setState({lastMEM: this.state.mProp['timeseriesDataCPUMEM'][1][this.memCnt-1]})
        this.setState({lastDISK: this.state.mProp['timeseriesDataDISK'][0][this.diskCnt-1]})
        this.setState({lastNET: [this.state.mProp['timeseriesDataNET'][0][this.netCnt-1], this.state.mProp['timeseriesDataNET'][1][this.netCnt-1] ]})
        this.setState({lastTCP: [this.state.mProp['timeseriesDataTCP'][0][this.tcpCnt-1], this.state.mProp['timeseriesDataTCP'][1][this.tcpCnt-1] ]})
        this.setState({lastUDP: [this.state.mProp['timeseriesDataUDP'][0][this.udpCnt-1], this.state.mProp['timeseriesDataUDP'][1][this.udpCnt-1] ]})
    }
    bytesToString =  (bytes, inst) => {
        console.log("20190812 bytes..",bytes, ":", inst)
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
        this.diskCnt = 0;
        this.netCnt = 0;
        this.tcpCnt = 0;
        this.udpCnt = 0;
        console.log('20190824 feedData-- ', data)
        if(data && data.mData.length) {
            data.mData.map(item => {
                if(item.name.indexOf('cpu') > -1) {
                    this.setTimeseriesDataCPUMEM('cpu',item['values'])
                } else if(item.name.indexOf('mem') > -1) {
                    this.setTimeseriesDataCPUMEM('mem',item['values'])
                } else if(item.name.indexOf('disk') > -1) {
                    this.setTimeseriesDataCPUMEM('disk',item['values'])
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
        if(this.props.data) {
            this.setState({data:this.props.data})
            this.feedData(this.props.data)
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.feedData(nextProps.data);
    }

    render() {
        return (
            <Grid.Row className="monitoring">
                <Grid.Column>
                    <div className='wrapperPercentage'>
                        <Segment className="childPercentage" inverted>
                            <Header>
                                CPU
                            </Header>
                            <Container className="cpu">{this.state.lastCPU + '%'}</Container>
                        </Segment>
                        <Segment className="childPercentage" inverted>
                            <Header>
                                MEMORY
                            </Header>
                            <Container className="memory">
                                {
                                    (this.props.data.page !== 'appInst')?this.state.lastMEM+'%':this.bytesToString(this.state.lastMEM, this.props.data.page, )
                                }

                            </Container>
                        </Segment>

                        {
                            (this.props.data.page !== 'appInst')?
                                <Segment className="childPercentage" inverted>
                                    <Header>
                                        DISK
                                    </Header>
                                    <Container className="disk">{this.state.lastDISK + '%'}</Container>
                                </Segment>
                                :
                                null
                        }
                        <Segment className="childPercentage" inverted>
                            <Header>
                                NETWORK
                            </Header>
                            <div className="content">
                                <Container className="network_rcv">
                                    <div className="title">RCV</div>
                                    {this.bytesToString(this.state.lastNET[0]) + '/sec'}
                                </Container>
                                <Container className="network_snd">
                                    <div className="title">SND</div>
                                    {this.bytesToString(this.state.lastNET[1]) + '/sec'}
                                </Container>
                            </div>
                        </Segment>
                        {
                            (this.props.data.page !== 'appInst')?
                                <Segment className="childPercentage" inverted>
                                    <Header>
                                        TCP
                                    </Header>
                                    <div className="content">
                                        <Container className="tcp_tcpretrans">
                                            <div className="title">TcpRetrans</div>
                                            {d3.format('.2s')(this.state.lastTCP[0])}
                                        </Container>
                                        <Container className="tcp_connsest">
                                            <div className="title">ConnsEst</div>
                                            {d3.format('.2s')(this.state.lastTCP[1])}
                                        </Container>
                                    </div>
                                </Segment>
                            :
                            null
                        }
                        {
                            (this.props.data.page !== 'appInst')?
                                <Segment className="childPercentage" inverted>
                                    <Header>
                                        UDP
                                    </Header>
                                    <div className="content">
                                        <Container className="udp_tcpretrans">
                                            <div className="title">RCV</div>
                                            {d3.format('.2s')(this.state.lastUDP[0])}
                                        </Container>
                                        <Container className="est_connsest">
                                            <div className="title">SND</div>
                                            {d3.format('.2s')(this.state.lastUDP[1])}
                                        </Container>
                                    </div>
                                </Segment>
                            :
                            null
                        }

                    </div>
                </Grid.Column>
                <Grid.Column style={{width:'100%', height:400}}>
                    <Header>CPU & MEMORY</Header>
                    <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataCPUMEM} series={this.state.mProp.timeseriesCPUMEM} showLegend={false}
                                margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabel} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                    {
                        (this.props.data.page !== 'appInst')?
                            <div style={{width:'100%', height:400}}>
                                <Header>DISK</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataDISK} series={this.state.mProp.timeseriesDISK}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelDISK} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                        :
                        null
                    }

                    <Header>NETWORK</Header>
                    <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataNET} series={this.state.mProp.timeseriesNET}
                                margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelNET} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                    {
                        (this.props.data.page !== 'appInst')?
                            <div style={{width:'100%', height:400}}>
                                <Header>TCP</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataTCP} series={this.state.mProp.timeseriesTCP}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelTCP} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                                :
                            null
                    }
                    {
                        (this.props.data.page !== 'appInst')?
                            <div style={{width:'100%', height:400, marginTop:20}}>
                                <Header>UDP</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataUDP} series={this.state.mProp.timeseriesUDP}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelUDP} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                                :
                            null
                    }


                </Grid.Column>
            </Grid.Row>
        )
    }
}
