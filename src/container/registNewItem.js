import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown} from "semantic-ui-react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RegistNewInput from "./registNewInput";

//http://react-s-alert.jsdemo.be/
import Alert from 'react-s-alert';

import * as service from "../services/service_compute_service";
import * as aggregate from "../utils";

let _self = null;
class RegistNewItem extends React.Component {
    constructor() {
        super();
        this.state = {
            dummyData:[],
            selected:{},
            open:false,
            dimmer:'',
            locationLong:null,
            locationLat:null,
            locationLongLat:[],
            toggle:false,
            operList:[],
            cloudletList:[],
            devOptionsOperator:[],
            devOptionsDeveloper:[],
            devOptionsCloudlet:[],
            devOptionsFour:[],
            devOptionsFive:[],
            devOptionsSix:[],
            devOptionsCF:[],
            dropdownValueOne:'',
            dropdownValueTwo:'',
            dropdownValueThree:'',
            dropdownValueFour:'',
            dropdownValueFive:'',
            dropdownValueSix:'',
            dropdownValueOrgType:'',
            dropdownValueOrgRole:'',
            cloudletResult:null,
            cloudlets:null,
            appResult:null,
            devOptionsOrgType:[
                {
                    key:'Developer',
                    value:'Developer',
                    text:'Developer',
                },
                {
                    key:'Operator',
                    value:'Operator',
                    text:'Operator',
                }
            ],
            devOptionsOrgRole:[
                {
                    key:'Manager',
                    value:'Manager',
                    text:'Manager',
                },
                {
                    key:'Contributor',
                    value:'Contributor',
                    text:'Contributor',
                },
                {
                    key:'Viewer',
                    value:'Viewer',
                    text:'Viewer',
                },
            ],
        }
        
        _self = this;
    }

    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        // developer(Organization)
        //service.getMCService('showOrg',{token:store.userToken}, _self.receiveDev)

        // operator, cloudlet
        service.getMCService('ShowCloudlet',{token:store.userToken,region:'US'}, _self.receiveOper)
        // clusterFlavor
        service.getMCService('ShowClusterFlavor',{token:store.userToken,region:'US'}, _self.receiveCF)
    }
    componentDidUpdate(){
        
    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps, this.state.cloudletList)
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
        }
        if(nextProps.selectOrg) {
            this.setState({devOptionsDeveloper:nextProps.selectOrg.Organization});
        }
        if(nextProps.submitData.registNewInput) {
            
            let cnArr = [];
            let locObj = null;
            const operValue = (nextProps.submitData.registNewInput.values)?nextProps.submitData.registNewInput.values.Operator:null;
            console.log("operValue@@",operValue)
            if(operValue) {
                console.log(this.state.operList)
                this.state.operList.map((item,i) => {
                    if(item.Operator == operValue) {
                        cnArr.push(item.CloudletName);
                    }
                })

                this.setState({cloudletList: cnArr.map((item, i) => (
                    { key: i, value: item, text: item }
                ))})
            }
            const cloudletValue = (nextProps.submitData.registNewInput.values)?nextProps.submitData.registNewInput.values.Cloudlet:null;
            console.log("LocationValue@@",cloudletValue)
            if(cloudletValue) {
                console.log("SSSSS###")
                this.state.operList.map((item,i) => {
                    if(item.CloudletName == cloudletValue) {
                        locObj = item.CloudletLocation;
                    }
                })
                console.log("locArrlocArr",locObj)
                this.setState({locationLong:locObj.longitude,locationLat:locObj.latitude,locationLongLat:[Number(locObj.longitude),Number(locObj.latitude)]});
            }
        }
        if(nextProps.data) {
            console.log('next props data -- -', nextProps.data)
            let groupByOper = aggregate.groupBy(nextProps.data, 'CloudletName')
            console.log('CloudletName ==>>>>>>>>> ', Object.keys(groupByOper));
            this.setCloudletList(Object.keys(groupByOper))
        }
        if(this.state.open && !this.state.toggle){
            let long = (nextProps.locLong.loc) ? nextProps.locLong.loc.props.placeholder : null;
            let lat = (nextProps.locLat.loc) ? nextProps.locLat.loc.props.placeholder : null;
            if(long && lat) {
                this.locationValue(long,lat)
            }
            this.setState({toggle:true});
        }
        let self = this;
        setTimeout(()=>{
            //console.log('ddd=', self['input_0'])
            //if(self['input_0']) self['input_0'].focus();
        }, 1000)
    }
    handleChangeOne = (e, {value}) => {
        console.log("operator@@@")
        this.setState({ dropdownValueOne: value })
        //reset list of sub dropwDown
        this.setCloudletList(value)
    }
    handleChangeTwo = (e, {value}) => {
        this.setState({ dropdownValueTwo: value })
        this.setAppList(value)
    }
    handleChangeThree = (e, {value}) => {
        this.setState({ dropdownValueThree: value })
    }
    handleChangeFour = (e, {value}) => {
        this.setState({ dropdownValueFour: value })
    }
    handleChangeFive = (e, {value}) => {
        console.log('change input value is ==', value)
        this.setState({ dropdownValueFive: value })
    }
    handleChangeSix = (e, {value}) => {
        console.log('change input value is ==', value)
        this.setState({ dropdownValueSix: value })
    }
    handleChangeOrgType = (e, {value}) => {
        console.log('change input value is ==', value)
        this.setState({ dropdownValueOrgType: value })
    }
    handleChangeOrgRole = (e, {value}) => {
        console.log('change input value is ==', value)
        this.setState({ dropdownValueOrgRole: value })
    }
    handleChangeLong = (e, {value}) => {
        console.log("longValue!@@",value)
        if(value > 180 || value < -180) {
            console.log("in",value)
            alert("-180 ~ 180");
            e.target.value=null;
            return
        }
        this.setState({ locationLong: value })
        if(value && this.state.locationLat) {
            this.locationValue(value,this.state.locationLat)
        }
    }
    handleChangeLat = (e, {value}) => {
        if(value > 90 || value < -90) {
            alert("-90 ~ 90");
            e.target.value=null;
            return
        }
        this.setState({ locationLat: value })
        if(value && this.state.locationLong) {
            this.locationValue(this.state.locationLong,value)
        }
    }
    locationValue = (long,lat) => {
        this.setState({ locationLongLat: [Number(long),Number(lat)] })
    }

    handleChangeLocate = (e, {value}) => {
        console.log('change input value is ==', value)

    }
    resetLoc = () => {
        this.setState({ locationLat: null,locationLong:null,toggle:false })
    }
    /*
    setCloudletList = (operNm) => {
        let cl = [];
        if(!_self.state.cloudletResult) return;
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueThree: oper.CloudletName})
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({devOptionsCloudlet: cl})
    }
    */
    setCloudletList = (list) => {
        let cl = [];

        list.map((item, i) => {
            if(i === 0) _self.setState({dropdownValueThree: item})
            cl.push({ key: i, value: item, text: item })
        })

        _self.setState({devOptionsCloudlet: cl})
    }
    setOrgList = (list) => {
        let cl = [];

        list.map((item, i) => {
            if(i === 0) _self.setState({dropdownValueOne: item})
            cl.push({ key: i, value: item, text: item })
        })

        _self.setState({devOptionsOperator: cl})
    }
    setAppList = (devNm) => {
        let cl = [];
        let vr = [];
        _self.state.appResult[devNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueFour: oper.AppName})
            cl.push({ key: i, value: oper.AppName, text: oper.AppName })
            vr.push({ key: i, value: oper.Version, text: oper.Version })

        })

        _self.setState({devOptionsFour: cl, devOptionsFive: vr})
    }
    //Show Option Operator(19.04.25)
    receiveOper(result) {
        console.log('operators ==>>>>>>>>>>>> ', result)
        let operArr = [];
        let CloudArr = [];
        result.map((item,i) => {
            operArr.push(item.Operator)
        })
        _self.setState({devOptionsOperator: [...new Set(operArr)].map((item, i) => (
            { key: i, value: item, text: item }
        )),operList:result})
        
    }
    //Show Option Organization(19.04.25)
    // receiveDev(result) {
    //     console.log('receive developer ==>>>>>>>>>>>> ', result)
    //     _self.setState({devOptionsDeveloper: result.map((item, i) => (
//             { key: i, value: item.Organization, text: item.Organization }
//         ))})
    // }

    //Show Option clusterFlavor(19.04.25)
    receiveCF(result) {
        console.log('receive CF ==>>>>>>>>>>>> ', result)
        _self.setState({devOptionsCF: result.map((item, i) => (
            { key: i, value: item.ClusterFlavor, text: item.ClusterFlavor }
        ))})
    }

    receiveCloudlet(result) {
        let groupByOper = aggregate.groupBy(result, 'Operator')
        console.log('receiveCloudlet ==>>>>>>>>> ', groupByOper)
        _self.setState({cloudletResult:groupByOper})
    }
    receiveApp(result) {
        console.log('receive app ==>>>>>>>>>>>> ', result)
        let groupByOper = aggregate.groupBy(result, 'DeveloperName')
        _self.setState({appResult:groupByOper})
    }
    receiveSubmit(result) {
        console.log('registry new ... success result..', result.data)
        if(result.error) {
            Alert.error(result.error, {
                position: 'top-right',
                effect: 'slide',
                onShow: function () {
                    console.log('error!')
                },
                beep: true,
                timeout: 5000,
                offset: 100
            });
            _self.props.handleSpinner(false)
            return;
        }
        let paseData = result.data;
        let splitData = JSON.parse( "["+paseData.split('}\n{').join('},\n{')+"]" );
        console.log('response paseData  -',splitData );

        if(splitData[2] && splitData[2]['result']) {
            Alert.success(splitData[2]['result']['message'], {
                position: 'top-right',
                effect: 'slide',
                onShow: function () {
                    console.log('aye!')
                },
                beep: true,
                timeout: 5000,
                offset: 100
            });
            //create success !!!
            if(splitData[2]['result']['message'] === 'Created successfully') {
                _self.props.success()
            }
        } else {
            if(splitData[0]['error']) {
                Alert.error(splitData[0]['error']['message'], {
                    position: 'top-right',
                    effect: 'slide',
                    onShow: function () {
                        console.log('aye!')
                    },
                    beep: true,
                    timeout: 5000,
                    offset: 100
                });
            } else {
                Alert.error(splitData[0]['message'], {
                    position: 'top-right',
                    effect: 'slide',
                    onShow: function () {
                        console.log('aye!')
                    },
                    beep: true,
                    timeout: 5000,
                    offset: 100
                });
            }

        }
        _self.props.handleSpinner(false)
    }

    onSubmit = () => {
        let serviceBody = {}
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        //playing spinner
        //this.props.handleSpinner(true)
        //console.log("siteId@@@",this.props)
        //TODO: 20190410 메뉴 별 구분 필요
        if(this.props.computeItem === 'Cluster Instances'){
            console.log("submitData@@",this.props.submitData)
            const {Cloudlet, ClusterFlavor, ClusterName, DeveloperName, Operator} = this.props.submitData.registNewInput.values
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":"US",
                    "clusterinst":{
                        "key":{
                            "cluster_key":{"name":ClusterName},
                            "cloudlet_key":{"operator_key":{"name":Operator},"name":Cloudlet},
                            "developer":DeveloperName
                        },
                        "flavor":{"name":ClusterFlavor}
                    }
                }
            }
            service.createNewClusterInst('CreateClusterInst', serviceBody, this.receiveSubmit)
        }
        //close
        //this.close();
        this.close();
    }
    close = () => {
        this.setState({ open: false })
        this.props.close()
    }
    onClickInput(a, b) {
        // setTimeout(()=>{
        //     console.log('ddd=', _self['input_'+b])
        //     if(_self['input_'+b]) _self['input_'+b].focus();
        // }, 2000)
    }

    longLocProps = (refVal) => {
        if(refVal) this.props.handleMapLong(refVal);
    }
    latLocProps = (refVal) => {
        if(refVal) this.props.handleMapLat(refVal);
    }
    

    render() {
        let {data, dimmer, selected} = this.props;
        let regKeys = (data[0])?data[0]['Edit']:null;
        console.log("data@@",data)
        let optionArr = [this.state.devOptionsOperator, this.state.devOptionsDeveloper, this.state.devOptionsCloudlet, this.state.devOptionsFour, this.state.devOptionsSix, this.state.devOptionsFive, this.state.devOptionsOrgType, this.state.devOptionsOrgRole, this.state.devOptionsCF]
        let valueArr = [this.state.dropdownValueOne, this.state.dropdownValueTwo, this.state.dropdownValueThree, this.state.dropdownValueFour, this.state.dropdownValueSix, this.state.dropdownValueFive, this.state.handleChangeOrgType, this.state.handleChangeOrgRole, this.state.handleChangeCF]
        let changeArr = [this.handleChangeOne, this.handleChangeTwo, this.handleChangeThree, this.handleChangeFour, this.handleChangeSix, this.handleChangeFive, this.handleChangeOrgType, this.handleChangeOrgRole]
        console.log('regKeys ===>>>', regKeys)
        return (
            <RegistNewInput
                handleSubmit={this.onSubmit}
                data={data}
                dimmer={dimmer}
                selected={selected}
                regKeys={regKeys}
                open={this.state.open}
                close={this.close}
                option={optionArr}
                value={valueArr}
                change={changeArr}
                longLoc={this.longLocProps}
                latLoc={this.latLocProps}
                zoomIn={this.props.zoomIn}
                zoomOut={this.props.zoomOut}
                resetMap={this.props.resetMap}
                locationLongLat={this.state.locationLongLat}
                resetLocation={this.resetLoc}
                handleChangeLong={this.handleChangeLong}
                handleChangeLat={this.handleChangeLat}
                locationLong={this.state.locationLong}
                locationLat={this.state.locationLat}
                defaultValue={this.props.selectOrg}
                cloudArr={this.state.cloudletList}
            >
            </RegistNewInput>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        locLong : state.mapCoordinatesLong?state.mapCoordinatesLong:null,
        locLat : state.mapCoordinatesLat?state.mapCoordinatesLat:null,
        submitData : state.form?state.form : null,
        computeItem : state.computeItem?state.computeItem.item:null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleMapLong: (data) => { dispatch(actions.mapCoordinatesLong(data))},
        handleMapLat: (data) => { dispatch(actions.mapCoordinatesLat(data))},
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistNewItem));

