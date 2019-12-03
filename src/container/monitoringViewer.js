import React from 'react';
import { Grid, Header, Segment, Container } from "semantic-ui-react";
import TimeSeries from '../charts/plotly/timeseries';
import EnvironmentStatus from '../container/envrmentStatus'
import UsageMaxColumn from '../charts/plotly/usageMaxColumn';
//import MethodCallChart from "../charts/plotly/methodCallChart";
import * as d3 from 'd3';
import './styles.css'

const formatInt = d3.format(".0f");
const formatComma = d3.format(",");
const formatFloat = d3.format(".2f");
const formatPercent = d3.format(".1f",".1f");

export default class MonitoringViewer extends React.Component {
    state = {
        mProp : {
            timeseriesDataCPUMEM:[
                [],[]
            ],
            timeseriesDataCPU:[
                [],[]
            ],
            timeseriesDataMEM:[
                [],[]
            ],
            timeseriesDataCPUUSE:[
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
            timeseriesDataACCEPTS:[
                []
            ],
            timeseriesDataACTIVE:[
                []
            ],
            timeseriesDataHANDLED:[
                []
            ],
            timeseriesDataCONNECT:[
                []
            ],
            timeseriesACCEPTS:[[]],
            dataLabel:['CPU', 'MEM'],
            dataLabelNET:['RCV', 'SND'],
            dataLabelDISK:['DISK'],
            dataLabelCONN:[''],
            dataLabelTCP:['RCV', 'SND'],
            dataLabelUDP:['RCV', 'SND', 'ERROR'],
        },
        lastCPU:0, lastMEM: 0, lastDISK:0, lastNET:[0,0], lastUDP:[0,0], lastTCP:[0,0],maxCPU:0,maxMEM:0, maxDISK:0,
        data:[]
    }

    cpuCnt = 0;
    memCnt = 0;
    netCnt = 0;
    diskCnt = 0;
    tcpCnt = 0;
    udpCnt = 0;
    conCnt = 0;

    setTimeseriesDataCPUMEM (label, values) {
        if(label === 'cpu') {
            this.state.mProp['timeseriesDataCPUMEM'][0][this.cpuCnt] = formatFloat(values['cmsn']);
            this.state.mProp['timeseriesCPUMEM'][0][this.cpuCnt] = values['time'];
            this.cpuCnt ++;
        }
        if(label === 'mem') {
            this.state.mProp['timeseriesDataCPUMEM'][1][this.memCnt] = values['cmsn'];
            this.memCnt ++;
        }
        if(label === 'disk') {
            this.state.mProp['timeseriesDataDISK'][0][this.diskCnt] = formatFloat(values['cmsn']);
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
        if(label === 'connections') {
            this.state.mProp['timeseriesDataACCEPTS'][0][this.connCnt] = values['cmsn'][1];
            this.state.mProp['timeseriesACCEPTS'][0][this.connCnt] = values['cmsn'][0];

            this.state.mProp['timeseriesDataACTIVE'][0][this.connCnt] = values['cmsn'][2];
            this.state.mProp['timeseriesACCEPTS'][0][this.connCnt] = values['cmsn'][0];

            this.state.mProp['timeseriesDataHANDLED'][0][this.connCnt] = values['cmsn'][7];
            this.state.mProp['timeseriesACCEPTS'][0][this.connCnt] = values['cmsn'][0];

            this.connCnt ++;
        }


        this.setState({props: this.state.mProp})
        this.setState({lastCPU: this.state.mProp['timeseriesDataCPUMEM'][0][this.cpuCnt-1]})
        this.setState({lastMEM: this.state.mProp['timeseriesDataCPUMEM'][1][this.memCnt-1]})
        this.setState({lastDISK: this.state.mProp['timeseriesDataDISK'][0][this.diskCnt-1]})

        this.setState({lastNET: [this.state.mProp['timeseriesDataNET'][0][this.netCnt-1], this.state.mProp['timeseriesDataNET'][1][this.netCnt-1] ]})
        this.setState({lastTCP: [this.state.mProp['timeseriesDataTCP'][0][this.tcpCnt-1], this.state.mProp['timeseriesDataTCP'][1][this.tcpCnt-1] ]})
        this.setState({lastUDP: [this.state.mProp['timeseriesDataUDP'][0][this.udpCnt-1], this.state.mProp['timeseriesDataUDP'][1][this.udpCnt-1] ]})

    }
    bytesToString =  (bytes, inst) => {
        //console.log("20190812 bytes..",bytes, ":", inst)
        // One way to write it, not the prettiest way to write it.

        var fmt = d3.format('.2f');
        if (bytes < 1000) {
            return fmt(bytes) + ' B';
        } else if (bytes < 1000 * 1000) {
            return fmt(bytes / 1000) + ' kB';
        } else if (bytes < 1000 * 1000 * 1000) {
            return fmt(bytes / 1000 / 1000) + ' MB';
        } else {
            return fmt(bytes / 1000 / 1000 / 1000) + ' GB';
        }
    }
    bytesToPercent=  (bytes, inst) => {
        //console.log("20190812 bytes..",bytes, ":", inst)
        // One way to write it, not the prettiest way to write it.

        var fmt = d3.format('.2f');
        return bytes + ' %'
    }

    gigabytesToString =  (bytes, inst) => {
        console.log("20190812 bytes..",bytes, ":", inst)
        // One way to write it, not the prettiest way to write it.
        var p = d3.precisionFixed(1),
            fmt = d3.format("." + p + "f");

        if (bytes < 1000) {
            return fmt(bytes) + ' B';
        } else if (bytes < 1000 * 1000) {
            return fmt(bytes / 1000) + ' KB';
        } else if (bytes < 1000 * 1000 * 1000) {
            return fmt(bytes / 1000 / 1000) + ' MB';
        } else {
            return fmt(bytes / 1000 / 1000 / 1000) + ' GB';
        }
    }
    feedData(data) {
        this.cpuCnt = 0;
        this.memCnt = 0;
        this.diskCnt = 0;
        this.netCnt = 0;
        this.tcpCnt = 0;
        this.udpCnt = 0;
        this.connCnt = 0;

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
                } else if(item.name.indexOf('accepts') > -1) {
                    this.setTimeseriesDataCPUMEM('accepts',item['values'])
                } else if(item.name.indexOf('connections') > -1) {
                    this.setTimeseriesDataCPUMEM('connections',item['values'])
                }
            })
        }
    }

    feedDataCloudlet(data) {
        this.cpuCnt = 0;
        this.memCnt = 0;
        this.diskCnt = 0;
        this.netCnt = 0;
        this.tcpCnt = 0;
        this.udpCnt = 0;

        //console.log('20191007 feedData-- ', data)
        if(data && data.length) {
            this.setState({lastCPU: data[0].values['cmsn']['vCpuUsed']})
            this.setState({lastMEM: data[0].values['cmsn']['memUsed']})
            this.setState({lastDISK: data[0].values['cmsn']['diskUsed']})

            this.setState({maxCPU: data[0].values['cmsn']['vCpuMax']})
            this.setState({maxMEM: data[0].values['cmsn']['memMax']})
            this.setState({maxDISK: data[0].values['cmsn']['diskMax']})
        }
        if(data.length){
            data.map((val) => {
                if(val.values['cmsn']['vCpuUsed']) {
                    this.state.mProp['timeseriesDataCPUMEM'][0][this.cpuCnt] = parseFloat(val.values['cmsn']['vCpuUsed']).toFixed(2);
                    this.state.mProp['timeseriesDataCPU'][0][this.cpuCnt] = parseFloat(val.values['cmsn']['vCpuUsed']).toFixed(2);
                    this.state.mProp['timeseriesCPUMEM'][0][this.cpuCnt] = val.values['time'];
                    this.cpuCnt ++;
                }
                if(val.values['cmsn']['vCpuMax']) {
                    this.state.mProp['timeseriesDataCPU'][1][this.cpuCnt] = parseFloat(val.values['cmsn']['vCpuMax']).toFixed(2);

                }
                if(val.values['cmsn']['memUsed']) {
                    this.state.mProp['timeseriesDataCPUMEM'][1][this.memCnt] = val.values['cmsn']['memUsed'];
                    this.state.mProp['timeseriesDataMEM'][0][this.memCnt] = val.values['cmsn']['memUsed'];
                    this.memCnt ++;
                }
                if(val.values['cmsn']['diskUsed']) {
                    this.state.mProp['timeseriesDataDISK'][0][this.diskCnt] = this.gigabytesToString(val.values['cmsn']['diskUsed']);
                    this.state.mProp['timeseriesDISK'][0][this.diskCnt] = val.values['time'];
                    this.diskCnt ++;
                }

            });
        }

        this.setState({props: this.state.mProp})
    }

    makeChartContainer = (title, lastValue, maxValue, unit, type) => (
        <Segment className="childPercentage cloudlet_monitoring" inverted>
            <Header>
                {title?title:'No Title'}
            </Header>
            {
                (this.props.data.page === 'cloudlet') ?
                    <Container className="cloudlet_monitoring_charts">
                        <div className="cloudlet_monitoring_charts_gauge">
                            <EnvironmentStatus data={[lastValue, maxValue]} type={unit} title='USED'/>
                        </div>
                        <div className="cloudlet_monitoring_charts_counting">
                            <div className="cloudlet_monitoring_charts_counting_max">
                                <div className="cloudlet_monitoring_charts_counting_max_title">MAX</div>
                                <div className="cloudlet_monitoring_charts_counting_max_value">
                                    <div className="cloudlet_monitoring_charts_counting_max_value_number">
                                        {(this.props.data.page === 'cloudlet')?maxValue/1000 : null}
                                    </div>
                                    <div className="cloudlet_monitoring_charts_counting_max_value_unit">
                                        {(this.props.data.page === 'cloudlet')?unit:null}
                                    </div>
                                </div>
                            </div>
                            <div className="cloudlet_monitoring_charts_counting_used">
                                <div className="cloudlet_monitoring_charts_counting_used_title">USED</div>
                                <div className="cloudlet_monitoring_charts_counting_used_value">
                                    <div className="cloudlet_monitoring_charts_counting_used_value_number">
                                        {(this.props.data.page !== 'appInst' && this.props.data.page !== 'cloudlet')? lastValue : lastValue/1000}
                                    </div>
                                    <div className="cloudlet_monitoring_charts_counting_used_value_unit">
                                        {(this.props.data.page !== 'appInst' && this.props.data.page !== 'cloudlet')?'%':unit}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                    :
                    (type === 'CPU')?<Container className="cpu">{this.state.lastCPU + ((this.props.data.page === 'cloudlet')?'Count' : '%')}</Container>
                        : (type === 'DISK') ? <Container className="disk">{
                            this.bytesToString(this.state.lastDISK)
                        }</Container>
                        : <Container className="memory">{
                            (this.props.data.page === 'clusterInst') ? this.bytesToPercent(this.state.lastMEM) : this.bytesToString(this.state.lastMEM)
                        }</Container>

            }
        </Segment>
    )

    componentDidMount() {

        if(this.props.data) {
            this.setState({data:this.props.data})
            this.feedData(this.props.data)
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.data.page === 'cloudlet' && nextProps.data.mData.length) {
            this.feedDataCloudlet(nextProps.data.mData);
        } else {
            this.feedData(nextProps.data);
        }


    }

    render() {
        return (
            <Grid.Row className="monitoring">
                <Grid.Column>
                    <div className='wrapperPercentage'>
                        {
                            this.makeChartContainer((this.props.data.page === 'cloudlet')?"vCPUs" : "CPU", this.state.lastCPU,  this.state.maxCPU, ' Count', 'CPU')
                        }

                        {
                            this.makeChartContainer('MEMORY', this.state.lastMEM, this.state.maxMEM, ' GBs', 'MEM')
                        }

                        {
                            (this.props.data.page !== 'appInst')?
                                this.makeChartContainer('DISK', this.state.lastDISK, this.state.maxDISK, ' GBs', 'DISK')
                                :
                                null
                        }
                        {
                            (this.props.data.page !== 'cloudlet')?
                                <Segment className="childPercentage" inverted>
                                    <Header>
                                        NETWORK
                                    </Header>
                                    <div className="content">
                                        <Container className="network_rcv">
                                            <div className="title">RCV</div>
                                            {this.bytesToString(this.state.lastNET[0]/1000)}
                                        </Container>
                                        <Container className="network_snd">
                                            <div className="title">SND</div>
                                            {this.bytesToString(this.state.lastNET[1]/1000)}
                                        </Container>
                                    </div>
                                </Segment>
                                :
                                null
                        }

                        {
                            (this.props.data.page !== 'appInst' && this.props.data.page !== 'cloudlet')?
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
                            (this.props.data.page !== 'appInst' && this.props.data.page !== 'cloudlet')?
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

                <Grid.Column style={{width:'100%', height:'100%'}}>
                    {
                        (this.props.data.page === 'cloudlet')?
                            null
                            :
                            <div style={{width:'100%', height:400}}>
                                <Header>{(this.props.data.page === 'cloudlet')?"vCPUs" : "CPU"}</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataCPUMEM} series={this.state.mProp.timeseriesCPUMEM} showLegend={true} single='0'
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabel} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                    }

                    {
                        (this.props.data.page === 'cloudlet')?
                            null
                            :
                            <div style={{width:'100%', height:400}}>
                                <Header>MEM</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataCPUMEM} series={this.state.mProp.timeseriesCPUMEM} showLegend={true} single='1'
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabel} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                    }




                    {
                        (this.props.data.page !== 'appInst' && this.props.data.page !== 'cloudlet')?
                            <div style={{width:'100%', height:400}}>
                                <Header>DISK</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataDISK} series={this.state.mProp.timeseriesDISK} showLegend={true}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelDISK} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                        :
                        null
                    }
                    {
                        (this.props.data.page !== 'cloudlet')?
                            <div style={{width:'100%', height:400}}>
                                <Header>NETWORK</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataNET} series={this.state.mProp.timeseriesNET} showLegend={true}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelNET} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                            :
                            null

                    }

                    {
                        (this.props.data.page !== 'appInst' && this.props.data.page !== 'cloudlet')?
                            <div style={{width:'100%', height:400}}>
                                <Header>TCP</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataTCP} series={this.state.mProp.timeseriesTCP} showLegend={true}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelTCP} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                                :
                            null
                    }
                    {
                        (this.props.data.page !== 'appInst' && this.props.data.page !== 'cloudlet')?
                            <div style={{width:'100%', height:400, marginTop:20}}>
                                <Header>UDP</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataUDP} series={this.state.mProp.timeseriesUDP} showLegend={true}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelUDP} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                                :
                            null
                    }
                    {
                        (this.props.data.page === 'appInst')?
                            <div style={{width:'100%', height:35, display:'flex', alignContent:'center'}}>
                                <div style={{fontSize:24, color:'#c5fffc', alignSelf:'center'}}>CONNECTIONS</div>
                            </div>
                            :
                            null
                    }
                    {
                        (this.props.data.page === 'appInst')?
                            <div style={{width:'100%', height:400}}>
                                <Header>ACCEPTS</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataACCEPTS} series={this.state.mProp.timeseriesACCEPTS} showLegend={true}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelCONN} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                            :
                            null
                    }
                    {
                        (this.props.data.page === 'appInst')?
                            <div style={{width:'100%', height:400}}>
                                <Header>ACTIVE</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataACTIVE} series={this.state.mProp.timeseriesACCEPTS} showLegend={true}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelCONN} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                            :
                            null
                    }
                    {
                        (this.props.data.page === 'appInst')?
                            <div style={{width:'100%', height:400}}>
                                <Header>HANDLED</Header>
                                <TimeSeries style={{width:'100%', height:200}} chartData={this.state.mProp.timeseriesDataHANDLED} series={this.state.mProp.timeseriesACCEPTS} showLegend={true}
                                            margin={{l: 50, r: 10, b: 45, t: 10, pad: 0}} label={this.state.mProp.dataLabelCONN} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>
                            </div>
                            :
                            null
                    }
                </Grid.Column>



            </Grid.Row>
        )
    }
}
