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
import HighCharts from '../charts/highChart';
import BBLineChart from '../charts/bbLineChart';
import TimeSeriesFlow from '../charts/plotly/timeseriesFlow';
import InterpolNumber from '../components/number/interpolNumber';



let dataOptions = [ { key: 'af', value: 'af', text: 'Disk W/R' },{ key: 'af2', value: 'af2', text: 'Networ I/O' } ]
const VerticalSidebar = ({ animation, direction, visible, gotoNext, cpu, mem, recv, send, network, networkSeries, lineLimit, redraw, cloudletInfo }) => (
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
                <Header>
                    <Header.Content onClick={gotoNext}>
                        {cloudletInfo}
                        <MaterialIcon icon={'arrow_forward'} />
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
                <Grid.Column className='category'>
                    <InterpolNumber className='value' sId={'RateOfReg'} value={10000}  format={null}/>
                    <div className='unit'>per sec</div>
                    <div className='label'>Rate of RegisterClient API</div>
                </Grid.Column>
                <Grid.Column className='category'>

                    <div className='label'></div>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2}>
                <Grid.Column className='category'>
                    <div className='value'>32,159</div>
                    <div className='label'>Current Connection</div>
                </Grid.Column>
                <Grid.Column className='category'>
                    <InterpolNumber className='value' sId={'AvgConnect'} format={null}/>
                    <div className='unit'>sec</div>
                    <div className='label'>Average Connection</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column className='category'>
                    <div className='value'>3.7356</div>
                    <div className='unit'>sec</div>
                    <div className='label'>Up Time</div>
                </Grid.Column>
                <Grid.Column  className='category'>
                    <div className='value'>2.0648</div>
                    <div className='unit'>sec</div>
                    <div className='label'>Down Time</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column className='category'>
                    <InterpolNumber className='value' sId={'RateOfFind'} format={null}/>
                    <div className='unit'>per sec</div>
                    <div className='label'>Rate of Find Cloudlet API</div>
                </Grid.Column>
                <Grid.Column className='category'>
                    <div className='value'>77</div>
                    <div className='label'>Total Number of Find Cloudlet API</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column className='category'>
                    <div className='value'>1.2845</div>
                    <div className='unit'>per sec</div>
                    <div className='label'>Rate of Location Verify API</div>
                </Grid.Column>
                <Grid.Column className='category'>
                    <div className='value'>28,875</div>
                    <div className='label'>Total Number of Location Verify API</div>
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
                    <CPUMEMUsage label="DISK" value={0.14}></CPUMEMUsage>
                </Grid.Column>
            </Grid.Row>
            {/*Network I/O*/}
            <Grid.Row columns={1}>
                <Grid.Column width={6}>
                    <Dropdown placeholder='Network I/O' fluid search selection options={dataOptions} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column width={5}>
                    <Grid.Row>
                        <NetworkInOutSimple type="in" cId="networkIn" colors={['#22cccc','#22cccc']} title="Network In" value={recv} unit="MB">></NetworkInOutSimple>
                        <NetworkInOutSimple type="out" cId="networkOut" colors={['#6699ff','#6699ff']} title="Network Out" value={send} unit="MB">></NetworkInOutSimple>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column width={11}>
                    {/*<HighCharts chart="line" style={{height:'100%'}}/>*/}
                    {/*<BBLineChart chartData={network} series={networkSeries} lineLimit={lineLimit}/>*/}
                    <TimeSeriesFlow style={{width:'300px', height:'150px'}} chartData={network} series={networkSeries} lineLimit={lineLimit} redraw={redraw}></TimeSeriesFlow>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Sidebar>
)

let _self = null;
class DeveloperSideInfo extends React.Component {


    constructor() {
        super();
        _self = this;
        this.state = {
            animation: 'overlay',
            direction: 'right',
            dimmed: false,
            visible: false,
            cpu:0, mem:0, recv:0, send:0, network:[], networkSeries:[],
            lineLimit:false,
            redraw:false, resetData:false,
            cloudletInfo:'Barcelona MWC Deutsche Telecom',
            city:'Barcelona'
        }
        this.dataArray = [];
        this.dataSeries = [];
        this.oldSeries = null;
        this.oldCity = '';
        //x axis length to divide
        this.limitDataLength = 15;
    }
    componentDidMount() {
        this.props.handleChangeCity({name:'barcelona'})
    }

    componentWillReceiveProps(nextProps) {

        this.setState({redraw:false})

        /********************
         *  새로운 지역 선택시에 네트워크 이전데이터 초기화
         ********************/

        if(nextProps.city.name && this.state.city !== nextProps.city.name) {
            console.log('새로운 지역 선택 == '+nextProps.city.name)
            this.dataArray = [];
            this.dataSeries = [];
            this.setState({dataArray:[], dataSeries:[], network:[], networkSeries:[], city:(nextProps.city.name)?nextProps.city.name:nextProps.city})
        }

        if(nextProps.data) {
            this.setState({visible:(nextProps.sideVisible) ? true : false});
            if(nextProps.data.cpuUsage) {
                this.setState({cpu:nextProps.data.cpuUsage})
            }
            if(nextProps.data.memUsage) {
                this.setState({mem:nextProps.data.memUsage})
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

        }
        if(nextProps.city) {
            let cdName = '';
            switch(nextProps.city.name) {
                case 'Barcelona': cdName = 'Barcelona MWC Deutsche Telecom'; break;
                case 'frankfurt': cdName = 'Franfrut MWC Macrometa'; break;
                case 'hamburg': cdName = 'Hamburg MWC Mexdemo'; break;
                default : cdName = 'Barcelona MWC Deutsche Telecom'; break;
            }

            this.setState({cloudletInfo:cdName, city:(nextProps.city.name)?nextProps.city.name : this.state.city})
        }

    }
    handleClickBtn() {
        _self.props.gotoNext();
    }


    render() {
        const { animation, dimmed, direction, visible } = this.state
        const vertical = direction === 'bottom' || direction === 'top'

        return (
            <div>
                <VerticalSidebar animation={animation} direction={direction} visible={visible} gotoNext={this.handleClickBtn}
                                 cpu={this.state.cpu} mem={this.state.mem} recv={this.state.recv}
                                 send={this.state.send} network={this.state.network} networkSeries={this.state.networkSeries}
                                 lineLimit={this.state.lineLimit} redraw={this.state.redraw}
                                 cloudletInfo={this.state.cloudletInfo}
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
