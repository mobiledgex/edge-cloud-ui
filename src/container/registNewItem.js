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
            validateError:[],
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
        

        // developer(Organization)
        //service.getMCService('showOrg',{token:store.userToken}, _self.receiveDev)
        
    }
    componentDidUpdate(){
        
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
        }
        
        if(nextProps.submitData.registNewInput) {
            
            let cnArr = [];
            let locObj = null;
            const operValue = (nextProps.submitData.registNewInput.values)?nextProps.submitData.registNewInput.values.Operator:null;
            if(operValue) {
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
            if(cloudletValue) {
                this.state.operList.map((item,i) => {
                    if(item.CloudletName == cloudletValue) {
                        locObj = item.CloudletLocation;
                    }
                })
                this.setState({locationLong:locObj.longitude,locationLat:locObj.latitude,locationLongLat:[Number(locObj.longitude),Number(locObj.latitude)]});
            }
        }
        if(nextProps.data) {
            let groupByOper = aggregate.groupBy(nextProps.data, 'CloudletName')
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
    }
    handleChangeOne = (e, {value}) => {
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
        this.setState({ dropdownValueFive: value })
    }
    handleChangeSix = (e, {value}) => {
        this.setState({ dropdownValueSix: value })
    }
    handleChangeOrgType = (e, {value}) => {
        this.setState({ dropdownValueOrgType: value })
    }
    handleChangeOrgRole = (e, {value}) => {
        this.setState({ dropdownValueOrgRole: value })
    }
    handleChangeLong = (e, {value}) => {
        if(value == '-') {
            this.setState({ locationLong: value })
            return
        }
        let onlyNum = value;
        if(onlyNum > 180 || onlyNum < -180) {
            this.props.handleAlertInfo('error',"-180 ~ 180")
            e.target.value=null;
            return
        }
        this.setState({ locationLong: onlyNum })
        this.locationValue(onlyNum,this.state.locationLat)
    }
    handleChangeLat = (e, {value}) => {
        if(value == '-') {
            this.setState({ locationLat: value })
            return
        }
        let onlyNum = value;
        if(onlyNum > 90 || onlyNum < -90) {
            this.props.handleAlertInfo('error',"-90 ~ 90")
            e.target.value=null;
            return
        }
        this.setState({ locationLat: onlyNum })
        this.locationValue(this.state.locationLong,onlyNum)
    }
    locationValue = (long,lat) => {
        if(long && lat){
            this.setState({ locationLongLat: [Number(long),Number(lat)] })
        } else {
            this.setState({ locationLongLat: null })
        }
        //this.setState({ locationLongLat: [Number(long),Number(lat)] })
    }

    handleChangeLocate = (e, {value}) => {

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
    //     _self.setState({devOptionsDeveloper: result.map((item, i) => (
//             { key: i, value: item.Organization, text: item.Organization }
//         ))})
    // }

    //Show Option clusterFlavor(19.04.25)
    receiveCF(result) {
        _self.setState({devOptionsCF: result.map((item, i) => (
            { key: i, value: item.FlavorName, text: item.FlavorName }
        ))})
    }

    receiveCloudlet(result) {
        let groupByOper = aggregate.groupBy(result, 'Operator')
        _self.setState({cloudletResult:groupByOper})
    }
    receiveApp(result) {
        let groupByOper = aggregate.groupBy(result, 'DeveloperName')
        _self.setState({appResult:groupByOper})
    }
    receiveOrg(result) {
        _self.setState({devOptionsDeveloper: result.map((item, i) => (
            { key: i, value: item.Organization, text: item.Organization }
        ))})
    }
    receiveSubmit(result) {
        // if(result.data.error) {
        //     // _self.props.handleCreatingSpinner(false);
        //     Alert.error(result.data.error, {
        //         position: 'top-right',
        //         effect: 'slide',
        //         onShow: function () {
        //             console.log('error!')
        //         },
        //         beep: true,
        //         timeout: 5000,
        //         offset: 100
        //     });
        //     return;
        // }
        //_self.props.handleLoadingSpinner(false);
        //_self.props.refresh()
        //데모용 잠시 막아놓음_190513
        // if(result.data.error) {
        //     Alert.error(result.data.error, {
        //         position: 'top-right',
        //         effect: 'slide',
        //         onShow: function () {
        //             console.log('error!')
        //         },
        //         beep: true,
        //         timeout: 5000,
        //         offset: 100
        //     });
        //     return;
        // } else {
        //     Alert.success('SUCCESS', {
        //         position: 'top-right',
        //         effect: 'slide',
        //         onShow: function () {
        //             console.log('aye!')
        //         },
        //         beep: true,
        //         timeout: 5000,
        //         offset: 100
        //     });
        // }
    }

    receiveSubmitCloudlet = (result, body) => {
        console.log('20191119 cloudlet receive submit cloudlet...', result.data)
        this.props.refresh('All')
        if(result.data.error) {
            this.props.handleAlertInfo('error',result.data.error)
            return;
        } else {
            this.props.handleAlertInfo('success','Cloudlet '+body.params.cloudlet.key.name+' created successfully')
        }
        this.props.handleLoadingSpinner(false);
    }

    onSubmit = () => {
        let serviceBody = {}
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        //this.props.handleLoadingSpinner(true);
        // setTimeout(() => {
        //     this.props.handleLoadingSpinner(false);
        // },3000);
        //TODO: 20190410 메뉴 별 구분 필요
        if(localStorage.selectMenu === 'Cluster Instances'){
            const {Cloudlet, Flavor, ClusterName, OrganizationName, Operator, Region, IpAccess, Number_of_Master, Number_of_Node} = this.props.submitData.registNewInput.values
            // this.props.handleCreatingSpinner(true);
            serviceBody = {
                "token":store ? store.userToken : 'null',
                "params": {
                    "region":Region,
                    "clusterinst":{
                        "key":{
                            "cluster_key":{"name":ClusterName},
                            "cloudlet_key":{"operator_key":{"name":Operator},"name":Cloudlet},
                            "developer":OrganizationName
                        },
                        "flavor":{"name":Flavor},
                        "ip_access":Number(IpAccess),
                        "num_masters":Number(Number_of_Master),
                        "num_nodes":Number(Number_of_Node)
                    }
                }
            }
            //this.props.handleLoadingSpinner(true);
            service.createNewClusterInst('CreateClusterInst', serviceBody, this.receiveSubmit)
        } else if(localStorage.selectMenu === 'Cloudlets') {
            const cloudlet = ['Region','CloudletName','OperatorName','Latitude','Longitude','Num_dynamic_ips']
            let error = [];
            cloudlet.map((item) => {
                if(!this.props.cloudletValue.values[item]) {
                    error.push(item)
                }
            })

            const {CloudletName, OperatorName, Latitude, Longitude, IpSupport, Num_dynamic_ips, Region} = this.props.submitData.registNewInput.values
            
            serviceBody = {
                "token":store ? store.userToken : 'null',
                "params": {
                    "region":Region,
                    "cloudlet":{
                        "key":{
                            "operator_key":{"name":OperatorName},
                            "name":CloudletName
                        },
                        "location":{
                            "latitude":Number(Latitude),
                            "longitude":Number(Longitude),
                            "timestamp":{}
                        },
                        "ip_support":IpSupport,
                        "num_dynamic_ips":Number(Num_dynamic_ips)
                    }
                }
            }
            if(error.length == 0) {
                this.close();
                this.props.handleLoadingSpinner(true);
                service.createNewCloudlet('CreateCloudlet', serviceBody, this.receiveSubmitCloudlet)
            }
            this.setState({validateError:error})

        }
        //close
        //this.close();
        
    }
    close = () => {
        this.setState({ open: false, validateError:[] })
        this.props.close()
    }

    longLocProps = (refVal) => {
        if(refVal) this.props.handleMapLong(refVal);
    }
    latLocProps = (refVal) => {
        if(refVal) this.props.handleMapLat(refVal);
    }
    getOptionData = (region) => {
        if(localStorage.selectMenu == "Cluster Instances") {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

            /** org show for cloudlet pool **/
            let organization = localStorage.getItem('selectOrg')
            if(organization) {
                alert('org='+organization)
                service.getMCService('showOrgCloudlet',{token:store ? store.userToken : 'null',params:{region:region, org:organization}}, _self.receiveOper)
            } else {
                service.getMCService('ShowCloudlet',{token:store ? store.userToken : 'null',region:region}, _self.receiveOper)
            }

            // Flavor
            setTimeout(() => service.getMCService('ShowFlavor',{token:store.userToken,region:region}, _self.receiveCF), 500);
        }
    }

    getOrgData = () => {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            // Organization
            service.getMCService('showOrg',{token:store ? store.userToken : 'null'}, this.receiveOrg)
        
    }
    

    render() {
        let {data, dimmer, selected} = this.props;
        const cloudletArr = ['Region','CloudletName','OperatorName','CloudletLocation','Ip_support','Num_dynamic_ips'];
        let regKeys = (data[0])?data[0]['Edit']:(this.props.siteId=='Cloudlet')?cloudletArr:[];
        let optionArr = [this.state.devOptionsOperator, this.state.devOptionsDeveloper, this.state.devOptionsCloudlet, this.state.devOptionsFour, this.state.devOptionsSix, this.state.devOptionsFive, this.state.devOptionsOrgType, this.state.devOptionsOrgRole, this.state.devOptionsCF]
        let valueArr = [this.state.dropdownValueOne, this.state.dropdownValueTwo, this.state.dropdownValueThree, this.state.dropdownValueFour, this.state.dropdownValueSix, this.state.dropdownValueFive, this.state.handleChangeOrgType, this.state.handleChangeOrgRole, this.state.handleChangeCF]
        let changeArr = [this.handleChangeOne, this.handleChangeTwo, this.handleChangeThree, this.handleChangeFour, this.handleChangeSix, this.handleChangeFive, this.handleChangeOrgType, this.handleChangeOrgRole]
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
                cloudArr={this.state.cloudletList}
                getOptionData={this.getOptionData}
                validError={this.state.validateError}
            >
            </RegistNewInput>
        )
    }
}

const mapStateToProps = (state) => {
    let formCloudlet= state.form.registNewInput
    ? {
        values: state.form.registNewInput.values
    }
    : {};
    return {
        locLong : state.mapCoordinatesLong?state.mapCoordinatesLong:null,
        locLat : state.mapCoordinatesLat?state.mapCoordinatesLat:null,
        submitData : state.form?state.form : null,
        computeItem : state.computeItem?state.computeItem.item:null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        cloudletValue:formCloudlet
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleMapLong: (data) => { dispatch(actions.mapCoordinatesLong(data))},
        handleMapLat: (data) => { dispatch(actions.mapCoordinatesLat(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},

        // handleCreatingSpinner: (data) => { dispatch(actions.creatingSpinner(data))}
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistNewItem));

