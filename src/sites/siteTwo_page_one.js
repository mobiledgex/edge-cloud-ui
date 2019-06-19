
//tab 클릭 이벤트 받기 redux 구조
//tab 클릭 이벤트 발생하면 페이지 넘기, 페이지 넘김 애니메이션 적용

import React from 'react';
import { Grid,Dropdown } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
import Alert from 'react-s-alert';
//
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
            savelocationData:null,
            url:'',
            countryOptionsOper : [{ key: 1000, value: 'default', text: 'Select Operator' }],
            countryOptionsDev : [{ key: 1000, value: 'default', text: 'Select Developer' }],
            countryOptionsClou : [{ key: 1000, value: 'default', text: 'Select Cloudlet' }],
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
            devGroup:null,
            selectedDevelop:'Select Develpoer',
            selectedCloudlet:'Select Cloudlet',
            zoom:'out',
            isFetching: false,
            multiple: true,
            search: true,
            searchQuery: null,
            value: [],
            condition:null

        }
        this.timeout = null;
        this.timeout2 = null;
        this.timeoutOnce = null;

    }
    handleChange = (e, { value }) => this.setState({ value })
    handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery })
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

        let locatData = _self.setLocationGroupData(result);
        _self.setState({
            locationData: locatData, savelocationData: locatData, cloudletsData:result
        })
        ////////////
        let nameObj = result.map((item) => (
            {operator:item.Operator, cloudlet:item.CloudletName}
        ))
        console.log('nameObj ', nameObj)
        _self.setState({nameObj:nameObj})
        let operatorsGroup = aggregation.groupBy(nameObj, 'operator');
        let operKeys = Object.keys(operatorsGroup)
        console.log('groupbyData operKeys ==>==> ', operKeys)

        let operators1 = [{ key: 1000, value: 'default', text: 'Select Operator' }]
        let operators2 = operKeys.map((opr, i) => ({ key: i, value: opr, text: opr }))
        _self.setState({countryOptionsOper:[...operators1, ...operators2], operGroup:operatorsGroup})
        /////////////
        _self.forceUpdate();

    }
    setLocationGroupData(result) {
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
        return locationData;
    }

    setAppinstGroupData(result) {
        function reduceUp(value) {
            return Math.round(value)
        }
        let locations = []

        result.map((item) => {
            _self.state.cloudletsData.map((cloudlet) => {
                if(item.cloudlet === cloudlet.CloudletName) locations.push({'LAT':reduceUp(cloudlet.CloudletLocation.latitude), 'LON':reduceUp(cloudlet.CloudletLocation.longitude), 'cloudlet':cloudlet.CloudletName, 'application':item.app})
            })
        })

        let locationData = [];

        let groupbyData = aggregation.groupByCompare(locations, ['LAT','LON']);
        console.log('grouby groupbyData = ', groupbyData)
        let names = []
        Object.keys(groupbyData).map((key, i) => {
            names[i] = [];
            groupbyData[key].map((data, j) => {
                names[i].push(data['application']+'  /  ');
                if(j === groupbyData[key].length -1) locationData.push({ "name": names[i],    "coordinates": [data['LON'], data['LAT']], "population": 17843000, "cost":groupbyData[key].length })
            })

        })
        console.log('location data ..... data ....data....', locationData)
        return locationData;
    }

    setLocationData(result) {

        let locationData = [];
        result.map((data, j) => {
            if(data) locationData.push({ "name": [data[0]['CloudletName']],    "coordinates": [data[0]['CloudletLocation']['longitude'], data[0]['CloudletLocation']['latitude']], "population": 17843000, "cost":data[0]['Operator'] })
        })

        console.log('location data ..... data ....data....', locationData)
        return locationData;
    }

    receiveAppInst(result) {
        console.log('result app inst  ---->>>> ', result)

        // //////////////////////////////
        // set developers to dropDown
        /////////////////////////////////
        let nameObj = result.map((item) => (
            {app:item.AppName, operator:item.OperatorName, developer:item.DeveloperName, cloudlet:item.CloudletName}
        ))

        // let nameObj = result.map((item) => (
        //     {developer:item.DeveloperName}
        // ))
        // console.log('nameObj ', nameObj)
        _self.setState({devGroup:nameObj})

        _self.forceUpdate();

    }
    receiveMehodData(result) {
        //TODO: counts call method from the developers
        _self.props.handleInjectData({methodCall:result})
    }

    shouldComponentUpdate(nextProps, nextState) {
        // if(nextProps.tabName !== this.props.tabName){
        //     return true;
        // }
        return true;
    }
    componentDidMount() {
        console.log('props pg is didmnt== '+this.props.tabName)
        function timeStringToFloat(time) {
            var startTime = new Date(time);
            var startMsec = startTime.getMilliseconds();

            return startMsec;

        }
        var every = 5000;
        var getDatas = function(self){
            //call data from service
            Service.getStatusCPU(self.receiveCPUData);
            Service.getStatusMEM(self.receiveMEMData);
            Service.getStatusFilesys(self.receiveFileData);
            Service.getStatusNET(self.receiveNETData);

            var old = new Date('2019-02-22 21:15:20').getTime();
            var newd = new Date().getTime();
            var sub = (newd - old)/(60*60*24);

            self.timeout = setTimeout(function(){getDatas(self)} , every)
        }
// 잠시막음 2019-03-27
        //getDatas(_self);

        if(this.props.tabName === 'pg=1') {
            this.setState({sideVisible: true})
        } else {
            this.setState({sideVisible: false})
        }

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        //get info cloudlet
        ComputeService.getMCService('ShowCloudlet',{token:store.userToken, region:'US'}, _self.receiveCloudlet)

        //get info appInstance
        setTimeout(() => ComputeService.getComputeService('appinst', this.receiveAppInst), 500);


        /*
        dropdownValueOne:'TDG',
            dropdownValueTwo:'barcelona-mexdemo',
            dropdownValueThree:'MobiledgeX SDK Demo',
         */

        _self.timeoutOnce = setTimeout(() => {
            if(this.props.tabName === 'pg=1') {
                _self.setState({dropdownValueOne:'TDG'})
                //_self.setDeveloperList({value:'TDG'});
                //_self.setCloudletList({value:'TDG'});
            }


        }, 2000)

    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
        clearTimeout(this.timeoutOnce)
        clearInterval(this.timeout2)

    }


    componentWillReceiveProps(nextProps) {
        console.log('mapStateToProps receive next props ------->>>>>>', nextProps)
        if(nextProps.city) {
            console.log('change city >>-->> ', nextProps.city.detailMode)
            if(nextProps.city.detailMode) {
                this.setState({sideVisible:true})
                return;
            } else {
                this.setState({sideVisible:false})
            }
            let cityName = String(nextProps.city.name)
            if(cityName !== 'dashboard'){
                this.zoomIn(nextProps.city.detailMode, nextProps.city.name)
            } else {
                console.log('city name .', nextProps.city.name)
            }
            //현재 Barcelona == dashboard
            let city = nextProps.city.name;
            // if(nextProps.city.name === 'barcelona' || nextProps.city.name === 'Barcelona') {
            //     city = 'dashboard'
            // }

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
    zoomIn(detailMode, obj) {
        console.log('zoom innnnnnnnnnnnnn', obj)
        _self.setState({sideVisible:detailMode})
        _self.setState({zoom:'in'})

        let cities = [];
        if(obj !== 'default' && typeof obj === 'object') {
            obj.map((city) => {
                cities.push(city.replace('  /  ', ''))
            })

            console.log('cities', cities, _self.state.cloudletsData)
        } else {
            cities.push(obj)
        }


        //find cloudlet in group
        let groupby = aggregation.groupBy(_self.state.cloudletsData, 'CloudletName')

        let selectedGroup = []

        cities.map((city) => {
            selectedGroup.push(groupby[city])
        })

        console.log('selected city in group..', groupby, selectedGroup);


        //set location of cloudlets binded grouped
        _self.setState({locationData:_self.setLocationData(selectedGroup)});


    }
    zoomOut(detailMode) {
        _self.setState({sideVisible:detailMode, zoom:'out'})
    }
    resetMap(detailMode, from) {

        if(from === 'fromDetail') {
            _self.setState({locationData:_self.state.savelocationData});
            _self.setState({sideVisible:detailMode})
        } else {
            _self.zoomOut(false)
        }
        _self.forceUpdate();
    }
    handleChangeOne = (e, {value}) => {
        _self.setState({ dropdownValueOne: value })
        // _self.setState({dropDownValueTwo:'Select Developer', dropDownValueThree:'Select Cloudlet',
        //     countryOptionsClou:[{ key: 1000, value: 'default', text: 'Select Cloudlet' }],
        //     countryOptionsDev:[{ key: 1000, value: 'default', text: 'Select Developer' }], selectedDevelop:''})

        //reset list of sub dropwDown
        if(value !== 'default'){
            _self.setDeveloperList(value);
            _self.setCloudletList(value);

            //filtering by cloudlet name
            let groupby = aggregation.groupBy(_self.state.cloudletsData, 'Operator')
            console.log('groupy operator..', groupby)
            let groupData = _self.setLocationGroupData(groupby[value]);
            if(groupby[value]) _self.setState({locationData:groupData});
        } else {
            _self.setState({locationData:_self.state.savelocationData});
        }
        _self.resetMap(false)
        _self.setState({sideVisible:false, condition:'one'})

        _self.forceUpdate();


    }

    // List of Developer
    /**********************
     * find the cloudlets filtered by Operator & Developer
     * @param e
     * @param value
     */
    handleChangeTwo = (e, {value}) => {
        console.log('change2.. value', value)

        _self.resetMap(false)
        _self.setState({sideVisible:false})

        if(value === 'default'){
            _self.resetMap(false)
            _self.setState({sideVisible:false})
        } else {
            //filtering by cloudlet name
            let groupby = aggregation.groupBy(_self.state.devGroup, 'developer')
            let filtered = [];
            let cloudlets = [];

            groupby[value].map((obj) => {

                // condition of..
                if(_self.state.dropdownValueOne !== 'default') {

                    if(_self.state.dropdownValueThree !== 'default') {

                        // operator & cloudlet
                        if(_self.state.dropdownValueOne === obj.operator && _self.state.dropdownValueThree === obj.cloudlet) {
                            //TODO: 2019-04-02 setting name of app to



                            cloudlets.push(obj);
                        }

                    } else {
                        // operator
                        if(_self.state.dropdownValueOne === obj.operator) {
                            cloudlets.push(obj);
                        }
                    }
                }
            })


            cloudlets.map((cld) => {
                _self.state.cloudletsData.map((cloudlet) => {
                    if(cloudlet['CloudletName'] === cld['cloudlet']) {
                        filtered.push(cld)
                    }
                })
            })

            console.log('groupy Developer..', groupby, groupby[value])
            if(filtered.length > 0) {
                _self.setState({locationData:_self.setAppinstGroupData(filtered)});
            } else {
                let err = 'There is no result'
                Alert.error(err, {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 5000
                });
                _self.props.handleChangeCity({name:value})
            }
        }
        _self.setState({ dropdownValueTwo: value, condition:'two' })
        _self.forceUpdate();
    }
    handleChangeThree = (e, {value}) => {
        if(value === 'default'){
            console.log('change2.. value', value)
            _self.setState({sideVisible:false})
        } else {
            _self.setState({sideVisible:true})
            //filtering by cloudlet name
            let groupby = aggregation.groupBy(_self.state.cloudletsData, 'CloudletName')
            console.log('groupy cloudlet..', groupby, groupby[value])
            if(groupby[value]) {
                _self.setState({locationData:_self.setLocationGroupData(groupby[value])});
            } else {
                let err = 'There is no result'
                Alert.error(err, {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 5000
                });
            }
        }
        _self.setState({ dropdownValueThree: value, condition:'three' })
        _self.props.handleChangeCity({name:value})
        _self.forceUpdate();
    }
    setDeveloperList(key) {
        let groupbyDevel = aggregation.groupBy(_self.state.devGroup, 'operator')
        let devData = (groupbyDevel[key]) ? aggregation.groupBy(groupbyDevel[key], 'developer'):{};

        let devKeys = Object.keys(devData)
        console.log('groupbyData developKeys ==>==> ', devKeys)
        let developers1 = [{ key: 0, value: 'default', text: 'Select Developer' }]
        let developers2 = devKeys.map((opr, i) => ({ key: i+1, value: opr, text: opr }))
        _self.setState({countryOptionsDev:[...developers1,...developers2]})
        _self.forceUpdate();
        //&&&&&&&&&& until set MWC &&&&&&&&&&&&&
        setTimeout(()=>{
            _self.setState({dropdownValueTwo:'default'})
            _self.setState({selectedDevelop:'Select Developer'})
        }, 4000)
    }
    setCloudletList(key) {
        let operatorsGroup = [];
        _self.state.operGroup[key].map((name) => {
            operatorsGroup.push(name)
        })
        let groupbyDevel = aggregation.groupBy(operatorsGroup, 'cloudlet')
        let operKeys = Object.keys(groupbyDevel)
        console.log('groupbyData cloudlet Keys ==>==> ', operKeys)
        let cloudlets1 = [{ key: 0, value: 'default', text: 'Select Cloudlet' }]
        let cloudlets2 = operKeys.map((opr, i) => ({ key: i+1, value: opr, text: opr }))
        _self.setState({countryOptionsClou:[...cloudlets1,...cloudlets2]})
        _self.forceUpdate();
        //&&&&&&&&&& until set MWC &&&&&&&&&&&&&
        setTimeout(()=>{
            _self.setState({dropdownValueThree:'default'})
            _self.setState({selectedCloudlet:'Select Cloudlet'})
        }, 3000)

    }
    /*

     */
    render() {
        return (
            <div id="bodyCont" className='console_body'>
                <div className='console_worldmap'>
                    <ContainerOne ref={ref => this.container = ref} tabIdx={this.props.tabName} data={this.state.locationData}
                                  gotoNext={this.gotoNext} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap}
                                  zoom={this.state.zoom} condition={this.state.condition}></ContainerOne>
                </div>

                <div className='console_nav_left'>
                    <div className='filter'>
                        <Dropdown placeholder='Select Operator' fluid search selection options={this.state.countryOptionsOper} value={this.state.dropdownValueOne} onChange={this.handleChangeOne}  />
                    </div>
                    <div className='filter'>
                        <Dropdown placeholder={this.state.selectedCloudlet} fluid search selection options={this.state.countryOptionsClou} value={this.state.dropdownValueThree} selectedLabel={this.state.selectedCloudlet} onChange={this.handleChangeThree} />
                    </div>
                    <div className='filter'>
                        <Dropdown placeholder={this.state.selectedDevelop} fluid search selection options={this.state.countryOptionsDev} value={this.state.dropdownValueTwo} selectedLabel={this.state.selectedDevelop}  onChange={this.handleChangeTwo}/>
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
    console.log('mapStateToProps in siteTwo_page_one...', state)
    return {
        city: Object.assign({}, state.cityChanger.city)
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
