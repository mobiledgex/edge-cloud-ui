import React, { Fragment } from "react";
import {Button, Form, Divider, Modal, Grid, Input, TextArea, Dropdown} from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import './styles.css';
import RegistNewListInput from "./registNewListInput";

import * as service from '../services/service_compute_service';

//http://react-s-alert.jsdemo.be/
import Alert from 'react-s-alert';

import * as aggregate from "../utils";


let _self = null;
class RegistNewListItem extends React.Component {
    constructor() {
        super();
        this.state = {
            dummyData:[],
            selected:{},
            open:false,
            dimmer:'',
            devOptionsOne:[],
            devOptionsTwo:[],
            devOptionsThree:[],
            devOptionsFour:[],
            devOptionsFive:[],
            devOptionsSix:[],
            dropdownValueOne:'',
            dropdownValueTwo:'',
            dropdownValueThree:'',
            dropdownValueFour:'',
            dropdownValueFive:'',
            dropdownValueSix:'',
            dropdownValueOrgType:'',
            dropdownValueOrgRole:'',
            cloudletResult:null,
            appResult:null,
            devOptionsMF:[],
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
       
        // clusterFlavor
        
        if(this.props.computeItem == "Cluster Flavors") {
            service.getMCService('ShowFlavor',{token:store.userToken,region:'US'}, _self.receiveMF)
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
        }

        let self = this;
        setTimeout(()=>{
            console.log('ddd=', self['input_0'])
            if(self['input_0']) self['input_0'].focus();
        }, 2000)

        
    }
    
    handleChangeOne = (e, {value}) => {
        this.setState({ dropdownValueOne: value })
        //reset list of sub dropwDown
        this.setCloudletList(value)
    }
    handleChangeTwo = (e, {value}) => {
        console.log("setChangeTwo>>>")
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
        console.log('change input value is ==', value)

    }
    handleChangeLat = (e, {value}) => {
        console.log('change input value is ==', value)

    }
    handleChangeLocate = (e, {value}) => {
        console.log('change input value is ==', value)

    }
    setCloudletList = (operNm) => {
        let cl = [];
        if(!_self.state.cloudletResult) return;
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueThree: oper.CloudletName})
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({devOptionsThree: cl})
    }
    setAppList = (devNm) => {
        console.log("setAppList>>>>")
        let cl = [];
        let vr = [];
        _self.state.appResult[devNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueFour: oper.AppName})
            cl.push({ key: i, value: oper.AppName, text: oper.AppName })
            vr.push({ key: i, value: oper.Version, text: oper.Version })

        })

        _self.setState({devOptionsFour: cl, devOptionsFive: vr})
    }

    receiveOper(result) {
        console.log('operators ==>>>>>>>>>>>> ', result)
        _self.setState({devOptionsOne: result.map((oper, i) => (
                { key: i, value: oper.OperatorName, text: oper.OperatorName }
            ))})
    }
    receiveDev(result) {
        console.log('receive developer ==>>>>>>>>>>>> ', result)
        _self.setState({devOptionsTwo: result.map((oper, i) => (
                { key: i, value: oper.DeveloperName, text: oper.DeveloperName }
            ))})
    }
    //190429
    receiveMF(result) {
        console.log('receive MF ==>>>>>>>>>>>> ', result)
        _self.setState({devOptionsMF: result.map((item, i) => (
            { key: i, value: item.FlavorName, text: item.FlavorName }
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
    receiveSubmit = (result) => {
        console.log('registry new ... success result..', result.data)
        this.props.handleLoadingSpinner(false);
        let paseData = result.data;
        // let splitData = JSON.parse( "["+paseData.split('}\n{').join('},\n{')+"]" );
        console.log('response paseData  -',paseData );

        if(paseData.message.indexOf('ok') > -1) {
            Alert.success("Created successfully", {
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
            // if(splitData[2]['result']['message'] === 'Created successfully') {
            //     _self.props.success()
            // }
            this.props.refresh()
        } else {
            Alert.error(paseData.message, {
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
       //_self.props.handleSpinner(false)
    }

    onSubmit = () => {
        console.log("ONSUBMIT@@")
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        console.log("computeItem@@@",this.props.computeItem)
        let serviceBody = {};

        //playing spinner
        //this.props.handleSpinner(true)

        //TODO: 20190410 메뉴 별 구분 필요
        if(this.props.computeItem === 'Flavors'){
            console.log("submitData@@",this.props.submitData)
            const {FlavorName,RAM,VCPUS,DISK,Region} = this.props.submitData.registNewListInput.values
            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":Region,
                    "flavor":{
                        "key":{"name":FlavorName},
                        "ram":Number(RAM),
                        "vcpus":Number(VCPUS),
                        "disk":Number(DISK)
                    }
                }
            }
            this.props.handleLoadingSpinner(true);
            service.createNewFlavor('CreateFlavor',serviceBody, this.receiveSubmit)
        } else if(this.props.computeItem === 'Cluster Flavors'){
            const {ClusterFlavor,MasterFlavor,NumberOfMasterNode,NodeFlavor,NumberOfNode,MaximumNodes,Region} = this.props.submitData.registNewListInput.values;

            serviceBody = {
                "token":store.userToken,
                "params": {
                    "region":Region,
                    "clusterflavor":{
                        "key":{"name":ClusterFlavor},
                        "node_flavor":{"name":NodeFlavor},
                        "master_flavor":{"name":MasterFlavor},
                        "num_nodes":Number(NumberOfNode),
                        "max_nodes":Number(MaximumNodes),
                        "num_masters":Number(NumberOfMasterNode)
                    }
                }
            }
            this.props.handleLoadingSpinner(true);
            service.createNewClusterFlavor('CreateClusterFlavor',serviceBody, this.receiveSubmit)
        }
        //close
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



    render() {
        let {data, dimmer, selected} = this.props;
        let regKeys = (data[0])?data[0]['Edit']:null;
        
        let optionArr = [this.state.devOptionsMF]
        let valueArr = [this.state.dropdownValueMF]
        let changeArr = [this.handleChangeMF]
        console.log('regKeys ===>>>', regKeys)
        return (
            <RegistNewListInput
                handleSubmit={this.onSubmit}
                data={data} dimmer={dimmer}
                selected={selected}
                regKeys={regKeys}
                open={this.state.open}
                close={this.close}
                option={optionArr}
                value={valueArr}
                change={changeArr}
            >
            </RegistNewListInput>
        )
    }
}


const mapStateToProps = (state) => {
    console.log('props in Flavor..', state)
    let formStepTwo= state.form.orgaStepTwo
    ? {
        values: state.form.orgaStepTwo.values,
        submitSucceeded: state.form.orgaStepTwo.submitSucceeded
    }
    : {};
    return {
        locLong : state.mapCoordinatesLong?state.mapCoordinatesLong:null,
        locLat : state.mapCoordinatesLat?state.mapCoordinatesLat:null,
        computeItem : state.computeItem?state.computeItem.item:null,
        userToken : state.user?state.user.userToken:null,
        submitData : state.form?state.form : null,
        stepTwo:formStepTwo
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleMapLong: (data) => { dispatch(actions.mapCoordinatesLong(data))},
        handleMapLat: (data) => { dispatch(actions.mapCoordinatesLat(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistNewListItem));
