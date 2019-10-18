import React, { StyleSheet } from 'react';
import {
    Button,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Menu,
    Segment,
    Sidebar, Label, Dropdown
} from 'semantic-ui-react';
import MaterialIcon from 'material-icons-react';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import CPUMEMUsage from '../container/usage/cupmemory';
import NetworkInOutSimple from '../components/network/networkInoutSimple';
import TimeSeriesFlow from '../charts/plotly/timeseriesFlow';
import TimeSeries from '../charts/plotly/timeseries';
import ScatterMethods from '../charts/plotly/scatterMethods';
import HistoricalColumn from '../charts/plotly/historicalColumn';
import * as aggregation from "../utils";
import MethodCallChart from "../charts/plotly/methodCallChart";


let customMargin = {
    l: 0,
    r: 0,
    b: 0,
    t: 0,
    pad: 0
}
let methodCounts = [{mtName:'',sum:0},{mtName:'',sum:0},{mtName:'',sum:0}]
let dataOptions = [ { key: 'af', value: 'af', text: 'Disk W/R' },{ key: 'af2', value: 'af2', text: 'Network I/O' } ]
const VerticalSidebar = ({ animation, direction, visible, gotoNext, cpu, mem, file, recv, send, network, networkSeries, lineLimit, redraw, cloudletInfo, scatterData, methodCounts, self }) => (
    <Sidebar
        as={Menu}
        animation={animation}
        direction={direction}
        icon='labeled'
        vertical
        visible={visible}
        className='console_sidebar'
    >
        <Grid>
            <Grid.Row>
                <Header style={{width:'100%'}}>
                    <Header.Content className="next">
                        <div style={{position:'relative'}} onClick={gotoNext}>
                            {cloudletInfo}
                            <MaterialIcon icon={'arrow_forward'} />
                        </div>
                        <div className="fold-icon" onClick={self.handleMinimize}><MaterialIcon icon={'arrow_right'} /></div>
                    </Header.Content>
                </Header>
            </Grid.Row>
            {/* 이벤트 시스템 알럿 시스로그*/}
            <Grid.Row columns={4}>
                <Grid.Column>
                    <Label>
                        0
                        <Label.Detail>Event</Label.Detail>
                        <MaterialIcon icon={'chevron_right'} size={32} />
                    </Label>
                </Grid.Column>
                <Grid.Column>
                    <Label>
                        0
                        <Label.Detail>System</Label.Detail>
                        <MaterialIcon icon={'chevron_right'} size={32} />
                    </Label>
                </Grid.Column>
                <Grid.Column>
                    <Label>
                        0
                        <Label.Detail>Alert</Label.Detail>
                        <MaterialIcon icon={'chevron_right'} size={32} />
                    </Label>
                </Grid.Column>
                <Grid.Column>
                    <Label>
                        0
                        <Label.Detail>Syslog</Label.Detail>
                        <MaterialIcon icon={'chevron_right'} size={32} />
                    </Label>
                </Grid.Column>
            </Grid.Row>

            {/* hit count for second */}
            <Grid.Row columns={2}>
                <Grid.Column width={5} className='hit_count'>
                    <Grid.Column>
                        <NetworkInOutSimple type="in" cId="RateOfReg" colors={['#22cccc','#22cccc']} title="Rate of RegisterClient" value={methodCounts[0]['sum']} unit="per sec">></NetworkInOutSimple>
                    </Grid.Column>
                    <Grid.Column>
                        <NetworkInOutSimple type="out" cId="RateOfFind" colors={['#6699ff','#6699ff']} title="Rate of FindCloudlet" value={methodCounts[1]['sum']} unit="per sec">></NetworkInOutSimple>
                    </Grid.Column>
                    <Grid.Column>
                        <NetworkInOutSimple type="out2" cId="RateOfVery" colors={['#aa77ff','#aa77ff']} title="Rate of VerifyLocation " value={methodCounts[2]['sum']} unit="per sec">></NetworkInOutSimple>
                    </Grid.Column>
                </Grid.Column>
                <Grid.Column width={11}>
                        {/*<ScatterMethods style={{width:'100%', height:'100%'}} data={scatterData} methodCounts={methodCounts}/>*/}
                        {/*<HistoricalColumn style={{width:'100%', height:'100%'}} data={scatterData} methodCounts={methodCounts}/>*/}
                        <MethodCallChart style={{width:'100%', height:'100%'}} chartData={scatterData} lineLimit={lineLimit} redraw={redraw} ratioCallForSecMethod={_self.ratioCallForSecMethod}></MethodCallChart>
                </Grid.Column>
            </Grid.Row>

            {/* cpu memory usage */}
            <Grid.Row columns={3}>
                <Grid.Column>
                    <CPUMEMUsage label="CPU" value={cpu}></CPUMEMUsage>
                </Grid.Column>
                <Grid.Column>
                    <CPUMEMUsage label="MEMORY" value={mem}></CPUMEMUsage>
                </Grid.Column>
                <Grid.Column>
                    <CPUMEMUsage label="DISK" value={file}></CPUMEMUsage>
                </Grid.Column>
            </Grid.Row>

            {/*Network I/O*/}
            <Grid.Row columns={2}>
                <Grid.Column width={5} className='network_count'>
                    <Grid.Row>
                        <Dropdown placeholder='Network I/O' fluid search selection options={dataOptions} />
                        <NetworkInOutSimple type="in" cId="networkIn" colors={['#22cccc','#22cccc']} title="Network In" value={recv} unit="B">></NetworkInOutSimple>
                        <NetworkInOutSimple type="out" cId="networkOut" colors={['#6699ff','#6699ff']} title="Network Out" value={send} unit="B">></NetworkInOutSimple>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column width={11}>
                    {/*<HighCharts chart="line" style={{height:'100%'}}/>*/}
                    {/*<BBLineChart chartData={network} series={networkSeries} lineLimit={lineLimit}/>*/}
                    <TimeSeriesFlow style={{width:'100%', height:'100%'}} chartData={network} series={networkSeries} lineLimit={lineLimit} redraw={redraw}></TimeSeriesFlow>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Sidebar>
)

let _self = null;
var colors = ['#22cccc', '#6699ff','#aa77ff', '#ff8e06' ];
var fontColor = 'rgba(255,255,255,.5)' ;
class DeveloperSideInfo extends React.Component {


    constructor() {
        super();
        _self = this;
        this.state = {
            animation: 'overlay',
            direction: 'right',
            dimmed: false,
            visible: false,
            cpu:0, mem:0, file:0, recv:0, send:0, network:[], networkSeries:[],
            lineLimit:false,
            redraw:false, resetData:false,
            cloudletInfo:'Deutsche Telecom Barcelona MWC',
            city:'Barcelona',
            scatterData:[],
            methodCounts: [{mtName:'',sum:0},{mtName:'',sum:0},{mtName:'',sum:0}]
        }
        this.dataArray = [];
        this.dataSeries = [];
        this.oldSeries = null;
        this.oldCity = '';
        //x axis length to divide
        this.limitDataLength = 15;
    }
    componentDidMount() {
        this.props.handleChangeCity({name:'dashboard'})
    }

    componentWillReceiveProps(nextProps) {

        this.setState({redraw:false})

        /********************
         *  새로운 지역 선택시에 네트워크 이전데이터 초기화
         ********************/

        if(nextProps.city.name && this.state.city !== nextProps.city.name) {
            console.log('새로운 cloudlet 선택 == ', nextProps.city)
            this.dataArray = [];
            this.dataSeries = [];
            this.setState({dataArray:[], dataSeries:[], network:[], networkSeries:[], city:(nextProps.city.name)?nextProps.city.name:nextProps.city})
        }

        this.setState({visible:(nextProps.sideVisible && nextProps.city.name !== 'default') ? true : false});

        if(nextProps.data) {
            if(nextProps.data.cpuUsage) {
                this.setState({cpu:nextProps.data.cpuUsage})
            }
            if(nextProps.data.memUsage) {
                this.setState({mem:nextProps.data.memUsage})
            }
            if(nextProps.data.filesystemUsage) {
                this.setState({file:nextProps.data.filesystemUsage})
            }

            if(nextProps.data.network) {
                //TODO: 네트웍데이터 가공하기
                /*
                [
                    ["data1", 30, 200, 100, 400, 150, 250],
                    ["data2", 50, 20, 10, 40, 15, 25]
                ]
                 */
                let keyLength = Object.keys(nextProps.data.network).length;
                let newData = true;
                let sCnt = 0;
                //console.log('data network -- ', nextProps.data.network)
                Object.keys(nextProps.data.network).map((key, i) => {
                    if(this.dataArray.length < Object.keys(nextProps.data.network).length) {
                        this.dataArray.push([])
                        this.dataSeries[0]=[]
                    } else {

                        if(nextProps.data.network[key] && this.oldSeries === nextProps.data.network[key].time){
                            newData = false;
                        } else {
                            newData = true;
                        }

                        //should limit display data in chart
                        /****************
                         * 차트에 표현할 데이터의 개수 정의
                         ****************/
                        if(this.dataArray[i] && this.dataArray[i].length > this.limitDataLength) {
                            //pop first data
                            this.dataArray[i].splice(0,1)
                            if(sCnt === (keyLength - 1)) this.dataSeries[0].splice(0,1)
                        }

                        if(newData && nextProps.data.network[key]) {
                            this.dataArray[i].push(Number(nextProps.data.network[key].score))
                            if(sCnt === (keyLength - 1)) {
                                this.dataSeries[0].push(nextProps.data.network[key].time)
                                this.oldSeries = nextProps.data.network[key].time;
                                //console.log('time series == ', this.dataSeries[0] , 'data length='+this.dataArray[i].length, 'limitDataLength='+this.limitDataLength)
                                if(this.dataSeries[0].length === (this.limitDataLength+1)){
                                    this.setState({lineLimit: true})
                                }
                                this.setState({redraw:true})
                            } else {

                            }
                            this.setState({[key]:nextProps.data.network[key].score})
                        }

                    }
                    sCnt ++;
                })

                if(newData){
                    this.setState({network:this.dataArray, networkSeries:this.dataSeries})
                }

            }


            if(nextProps.data && nextProps.data.methodCall) {
                let methodName = ['FindCloudlet', 'RegisterClient', 'GetFqdnList']
                let mthData = nextProps.data.methodCall;
                let groupDev = aggregation.groupBy(mthData, 'dev')
                let groupTime = aggregation.groupBy(mthData, 'time')
                let timeKeys = Object.keys(groupTime);
                let dataComp = [];
                let summaryMth = [{mtName:'', sum:0},{mtName:'', sum:0},{mtName:'', sum:0}];
                let devKeys = Object.keys(groupDev); // samsung, neon2...

                methodName.map((name, i) => {
                    // y array : method 당 호출 카운드
                    let mthCount = 0;
                    let mthTotalCount = 0;
                    devKeys.map(dName => {
                        groupDev[dName].map(obj => {
                            if(obj.method === name) mthCount ++;
                        })
                        mthTotalCount += mthCount;
                    })

                    summaryMth[i]['mtName'] = name;
                    summaryMth[i]['sum'] = mthTotalCount / 3600; //call every 60 secons

                })

                _self.setState({scatterData:nextProps.data, methodCounts:summaryMth})

            }

        }
        if(nextProps.city) {
            let cdName = 'No Name of Cloudlet';

            cdName = nextProps.city.name;

            this.setState({cloudletInfo:cdName, city:(nextProps.city.name)?nextProps.city.name : this.state.city})
        }





    }
    handleClickBtn() {
        _self.props.gotoNext();
    }
    handleMinimize() {
        _self.setState({visible: !_self.state.visible})
    }


    render() {
        const { animation, dimmed, direction, visible } = this.state
        const vertical = direction === 'bottom' || direction === 'top'

        return (
            <div>
                <VerticalSidebar animation={animation} direction={direction} visible={visible} gotoNext={this.handleClickBtn}
                                 cpu={this.state.cpu} mem={this.state.mem} file={this.state.file} recv={this.state.recv}
                                 send={this.state.send} network={this.state.network} networkSeries={this.state.networkSeries}
                                 lineLimit={this.state.lineLimit} redraw={this.state.redraw}
                                 cloudletInfo={this.state.cloudletInfo} scatterData={this.state.scatterData} methodCounts={this.state.methodCounts}
                                 methodCall={this.state.methodCall} self={this}
                />
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
        //console.log('dev side info -- ', state.cityChanger.city)
    return {
        data: state.receiveDataReduce.data,
        city: state.cityChanger.city
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeCity: (data) => { dispatch(actions.changeCity(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(DeveloperSideInfo);
