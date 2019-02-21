
//TODO:
//tab 클릭 이벤트 받기 redux 구조
//tab 클릭 이벤트 발생하면 페이지 넘기, 페이지 넘김 애니메이션 적용

import React from 'react';
import { Grid,Dropdown } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
//
import BubbleMaps from '../libs/simpleMaps/bubbles-map';
import AnimatedMap from '../libs/simpleMaps/with-react-motion';
import DeveloperSideInfo from '../container/developerSideInfo'
//service
import * as Service from '../services';
import * as ComputeService from '../services/service_compute_service';
//
import * as aggregation from '../utils';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import './siteTwo_page_one.css';

let _self = null;
const ContainerOne = (props) => (

    <AnimatedMap parentProps={props}/>

);

class SiteTwoPageOne extends React.Component  {
    constructor(props){
        super(props)
        _self = this;
        _self.state = {
            locationData:null,
            url:'',
            countryOptionsOper : [],
            countryOptionsDev : [],
            countryOptionsClou : [],
            sideVisible: false,
            cpuUsage:null,
            memUsage:null,
            network:null,
            everyCall:true,
            selectedCity:'dashboard',
            dropdownValueOne:null,
            dropdownValueTwo:null,
            dropdownValueThree:null,
            operGroup:null,
            selectedDevelop:'',
            selectedCloudlet:'',
            zoom:''

        }
        this.timeout = null;

    }
    clearData() {


        //TODO : 각 페이지에 데이터 전달하기 위해 redux 엑션 발생
        this.props.handleInjectData(null);

    }
    /*********************
     * Call Data from Server as REST
     **********************/
    receiveCPUData(data) {
        //console.log('slected city = '+_self.state.selectedCity);
        let _data = null
        data.map((key, i) => {
            if(key.inst.indexOf(_self.state.selectedCity) > -1) _data = data[i]
        })
        if(_data) {
            _self.setState({cpuUsage:_data.score})
            _self.props.handleInjectData({cpuUsage:_data.score});
        }
    }
    receiveMEMData(data) {
        //console.log('selected city = '+_self.state.selectedCity);
        let _data = null
        data.map((key, i) => {
            if(key.inst.indexOf(_self.state.selectedCity) > -1) _data = data[i]
        })
        if(_data){
            _self.setState({memUsage:_data.score})
            _self.props.handleInjectData({memUsage:_data.score});
        }
    }
    receiveNETData(dataIn, dataOut) {
        let _dataIn = null;
        dataIn.map((key, i) => {
            if(key.inst.indexOf(_self.state.selectedCity) > -1) _dataIn = dataIn[i]
        })
        let _dataOut = null;
        dataOut.map((key, i) => {
            if(key.inst.indexOf(_self.state.selectedCity) > -1) _dataOut = dataOut[i]
        })

        _self.props.handleInjectData({network:{recv:_dataIn, send:_dataOut}});

    }
    receiveFileData(data) {
        let _dataIn = null;
        data.map((key, i) => {
            if(key.inst.indexOf(_self.state.selectedCity) > -1) _dataIn = data[i]
        })

        if(_dataIn) _self.props.handleInjectData({filesystemUsage:_dataIn.score});

    }
    receiveCloudlet(result) {
        console.log('receive cloudlet  result... ', result)
        function reduceUp(value) {
            return Math.round(value)
        }
        let locations = result.map((item) => (
            {LAT:reduceUp(item.CloudletLocation.latitude), LON:reduceUp(item.CloudletLocation.longitude), cloudlet:item.CloudletName}
        ))


        let locationData = [];

        let groupbyData = aggregation.groupByCompare(locations, ['LAT','LON']);
        console.log('grouby groupbyData = ', groupbyData)
        let names = []
        Object.keys(groupbyData).map((key, i) => {
            names[i] = [];
            groupbyData[key].map((data, j) => {
                names[i].push(data['cloudlet']+'  /  ');
                if(j === groupbyData[key].length -1) locationData.push({ "name": names[i],    "coordinates": [data['LON'], data['LAT']], "population": 17843000, "cost":groupbyData[key].length })
            })

        })



        console.log('location data ..... data ....data....', locationData)

        _self.setState({
            locationData: locationData
        })


    }
    receiveAppInst(result) {
        console.log('result ---->>>> ', result)



        // //////////////////////////////
        // set operators to dropDown
        /////////////////////////////////
        let nameObj = result.map((item) => (
            {operator:item.OperatorName, developer:item.DeveloperName, cloudlet:item.CloudletName}
        ))
        console.log('nameObj ', nameObj)
        _self.setState({nameObj:nameObj})
        let operatorsGroup = aggregation.groupBy(nameObj, 'operator');
        let operKeys = Object.keys(operatorsGroup)
        console.log('groupbyData operKeys ==>==> ', operKeys)
        let operators = operKeys.map((opr, i) => ({ key: i, value: opr, text: opr }))
        _self.setState({countryOptionsOper:operators, operGroup:operatorsGroup})

    }
    componentDidMount() {
        console.log('props pg is didmnt== '+this.props.tabName)
        var every = 3000;
        var getDatas = function(self){
            //call data from service
            Service.getStatusCPU(self.receiveCPUData);
            Service.getStatusMEM(self.receiveMEMData);
            Service.getStatusFilesys(self.receiveFileData);
            Service.getStatusNET(self.receiveNETData);
            //
            Service.getComputService();
            self.timeout = setTimeout(function(){getDatas(self)} , every)
        }

        getDatas(_self);

        if(this.props.tabName === 'pg=1') {
            this.setState({sideVisible: true})
        } else {
            this.setState({sideVisible: false})
        }

        //get info cloudlet
        ComputeService.getComputeService('cloudlet', this.receiveCloudlet)

        //get info appInstance
        ComputeService.getComputeService('appinst', this.receiveAppInst)


        /*
        dropdownValueOne:'TDG',
            dropdownValueTwo:'barcelona-mexdemo',
            dropdownValueThree:'MobiledgeX SDK Demo',
         */

        setTimeout(() => {
            //_self.setState({dropdownValueOne:'TDG'})
            //_self.setDeveloperList({value:'TDG'});
            //_self.setCloudletList({value:'TDG'});
        }, 2000)

    }

    componentWillUnmount() {
        clearTimeout(this.timeout)


    }


    componentWillReceiveProps(nextProps) {

        if(nextProps.city) {
            console.log('change city -->> ', nextProps.city.name, this.state.zoom)
            this.setState({sideVisible:(this.state.zoom === 'in')?true:false})

            //현재 Barcelona == dashboard
            let city = nextProps.city.name;
            // if(nextProps.city.name === 'barcelona' || nextProps.city.name === 'Barcelona') {
            //     city = 'dashboard'
            // }
            if(nextProps.city.name.indexOf('frankfurt') > -1) {
                city = 'frankfurt'
            } else if(nextProps.city.name.indexOf('bonn') > -1) {
                city = 'bonn'
            } else if(nextProps.city.name.indexOf('barcelona') > -1) {
                city = 'dashboard'
            } else if(nextProps.city.name.indexOf('berlin') > -1 || nextProps.city.name.indexOf('skt') > -1) {
                city = 'berlin'
            }
            this.setState({selectedCity:city})
        }

    }

    //go to NEXT
    gotoNext(value) {
        //브라우져 입력창에 주소 기록
        let mainPath = '/site3';
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { cloudlet: _self.state.dropdownValueThree }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath, cloudlet:_self.state.dropdownValueThree})

    }
    zoomIn(detailMode) {
        //_self.setState({sideVisible:detailMode})
        _self.setState({zoom:'in'})
    }
    zoomOut(detailMode) {
        _self.setState({sideVisible:detailMode, zoom:'out'})
    }
    resetMap(detailMode) {
        _self.setState({sideVisible:detailMode})
    }
    handleChangeOne = (e, {value}) => {
        this.setState({ dropdownValueOne: value })
        this.setState({dropDownValueTwo:'', countryOptionsDev:[], selectedDevelop:''})
        //reset list of sub dropwDown
        this.setDeveloperList(value);
        this.setCloudletList(value);
    }
    handleChangeThree = (e, {value}) => {
        this.setState({ dropdownValueThree: value })
        this.props.handleChangeCity({name:value})
    }
    setDeveloperList(key) {
        let operatorsGroup = [];
        _self.state.operGroup[key].map((name) => {
            operatorsGroup.push(name)
        })
        let groupbyDevel = aggregation.groupBy(operatorsGroup, 'developer')
        let operKeys = Object.keys(groupbyDevel)
        console.log('groupbyData developKeys ==>==> ', operKeys)
        let developers = operKeys.map((opr, i) => ({ key: i, value: opr, text: opr }))
        _self.setState({countryOptionsDev:developers})

        //&&&&&&&&&& until set MWC &&&&&&&&&&&&&
        //setTimeout(()=>_self.setState({dropdownValueTwo:'MobiledgeX SDK Demo'}), 2500)
    }
    setCloudletList(key) {
        let operatorsGroup = [];
        _self.state.operGroup[key].map((name) => {
            operatorsGroup.push(name)
        })
        let groupbyDevel = aggregation.groupBy(operatorsGroup, 'cloudlet')
        let operKeys = Object.keys(groupbyDevel)
        console.log('groupbyData cloudlet Keys ==>==> ', operKeys)
        let developers = operKeys.map((opr, i) => ({ key: i, value: opr, text: opr }))
        _self.setState({countryOptionsClou:developers})

        //&&&&&&&&&& until set MWC &&&&&&&&&&&&&
        //setTimeout(()=>_self.setState({dropdownValueThree:'barcelona-mexdemo'}), 2000)

    }
    render() {
        return (
            <div id="bodyCont" className='console_body'>
                <div className='console_worldmap'>
                    <ContainerOne ref={ref => this.container = ref} tabIdx={this.props.tabName} data={this.state.locationData} gotoNext={this.gotoNext} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap}></ContainerOne>
                </div>

                <div className='console_nav_left'>
                    <div className='filter'>
                        <Dropdown placeholder='Select Operator' fluid search selection options={this.state.countryOptionsOper} value={this.state.dropdownValueOne} onChange={this.handleChangeOne}  />
                    </div>
                    <div className='filter'>
                        <Dropdown placeholder='Select Cloudlet' fluid search selection options={this.state.countryOptionsClou} value={this.state.dropdownValueThree} selectedLabel={this.state.selectedCloudlet} onChange={this.handleChangeThree} />
                    </div>
                    <div className='filter'>
                        <Dropdown placeholder='Select Developer' fluid search selection options={this.state.countryOptionsDev} value={this.state.dropdownValueTwo} selectedLabel={this.state.selectedDevelop} />
                    </div>
                </div>

                <div className='console_right_content'>
                    <DeveloperSideInfo sideVisible={this.state.sideVisible} gotoNext={this.gotoNext}></DeveloperSideInfo>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    let tab = state.siteChanger.site;

    return {
        tabName: tab.subPath,
        city: state.cityChanger.city
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeCity: (data) => { dispatch(actions.changeCity(data))},
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectNetworkData(data))},
    };
};
SiteTwoPageOne.defaultProps = {
    tabName : 0,
    onReceive: {data:null}
}
export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteTwoPageOne));
