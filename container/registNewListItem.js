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
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
       
    }
    componentWillReceiveProps(nextProps, nextContext) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
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
        _self.setState({devOptionsOne: result.map((oper, i) => (
                { key: i, value: oper.OperatorName, text: oper.OperatorName }
            ))})
    }
    receiveDev(result) {
        _self.setState({devOptionsTwo: result.map((oper, i) => (
                { key: i, value: oper.DeveloperName, text: oper.DeveloperName }
            ))})
    }
    //190429
    receiveMF(result) {
        _self.setState({devOptionsMF: result.map((item, i) => (
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
    receiveSubmit = (result, body) => {
        
        this.props.refresh('All')
        let paseData = result.data;
        if(paseData.error) {
            this.props.handleAlertInfo('error',paseData.error)
            return
        } else {
            this.props.handleAlertInfo('success','Flavor '+body.params.flavor.key.name+' created successfully')
        }
        this.props.handleLoadingSpinner(false);
    }

    onSubmit = () => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let serviceBody = {};

        //playing spinner
        //this.props.handleSpinner(true)



        //TODO: 20190410 메뉴 별 구분 필요
        if(localStorage.selectMenu === 'Flavors'){
            const flavor = ['Region','FlavorName','RAM','vCPUs','Disk']
            let error = [];
            flavor.map((item) => {
                if(!this.props.flavorValue.values[item]) {
                    error.push(item)
                }
            })

            const {FlavorName,RAM,vCPUs,Disk,Region} = this.props.submitData.registNewListInput.values
            serviceBody = {
                "token":store ? store.userToken : 'null',
                "params": {
                    "region":Region,
                    "flavor":{
                        "key":{"name":FlavorName},
                        "ram":Number(RAM),
                        "vcpus":Number(vCPUs),
                        "disk":Number(Disk)
                    }
                }
            }
            if(error.length == 0) {
                this.close();
                this.props.handleLoadingSpinner(true);
                service.createNewFlavor('CreateFlavor',serviceBody, this.receiveSubmit)
            }
            this.setState({validateError:error})
        }

    }
    close = () => {
        this.setState({ open: false })
        this.props.close()
    }

    render() {
        let {data, dimmer, selected} = this.props;
        let regKeys = (data[0])?data[0]['Edit']:null;
        
        let optionArr = [this.state.devOptionsMF]
        let valueArr = [this.state.dropdownValueMF]
        let changeArr = [this.handleChangeMF]
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
                validError={this.state.validateError}
            >
            </RegistNewListInput>
        )
    }
}


const mapStateToProps = (state) => {

    let formFlavor= state.form.registNewListInput
    ? {
        values: state.form.registNewListInput.values
    }
    : {};
    return {
        locLong : state.mapCoordinatesLong?state.mapCoordinatesLong:null,
        locLat : state.mapCoordinatesLat?state.mapCoordinatesLat:null,
        computeItem : state.computeItem?state.computeItem.item:null,
        userToken : state.user?state.user.userToken:null,
        submitData : state.form?state.form : null,
        flavorValue:formFlavor
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleMapLong: (data) => { dispatch(actions.mapCoordinatesLong(data))},
        handleMapLat: (data) => { dispatch(actions.mapCoordinatesLat(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistNewListItem));
