import React, { Fragment } from "react";
import {Button, Form, Item, Message, List, Grid, Card, Header, Image, Input} from "semantic-ui-react";
import {Field, reduxForm, initialize, reset, stopSubmit} from "redux-form";
import SiteFourCreatePoolForm  from './siteFourCreatePoolForm';
import * as services from '../services/service_compute_service';
import * as poolServices from '../services/service_cloudlet_pool';
import './styles.css';
import * as reducer from "../utils";

let _self = null;
let rgn = [];
class SiteFourPoolUpdateView extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            typeValue:'',
            propsData:[],
            selectedData:[],
            keys: [],
            selectListData: []
        };
        this._memberDummy = [];
        this._linkDummy = [];

    }

    handleInitialize() {
        let cType = this.props.type.substring(0,1).toUpperCase() + this.props.type.substring(1);
        const initData = {
            "orgName": this.props.org,
            "orgType": cType
        };

        this.props.initialize(initData);
    }

    receiveResult = (result) => {
        console.log('20191231 show org result -- ', result)

        if(result.data && result.data.length) {
            _self.countJoin(result.data)
        } else if(result && result.length){
            _self.countJoin(result)
        }

    }

    receiveResultMember = (result) => {
        let cloudletData = [];
        let poolName = this.state.selectedData['poolName']
        result.map((item) =>{
            if(poolName === item.PoolName){
                cloudletData.push(item.Cloudlet)
            }
        })
        this.state.selectListData = cloudletData
    }

    receiveResultLinkOrg = (result) => {
        let orgData = [];
        let poolName = this.state.selectedData['poolName']
        result.map((item) =>{
            if(poolName === item.PoolName){
                orgData.push(item['Org'])
            }
        })
        this.state.selectListData = orgData
    }

    getDataList = () => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData:[]})
        let updateType = this.props.updateType;
        if(updateType === 'cloudlet'){
            services.getMCService('ShowCloudlet',{token:store.userToken, region:this.props.selectedData.region}, _self.receiveResult)
            poolServices.getListCloudletPoolMember('ShowCloudletPoolMember',{token:store.userToken, region:this.props.selectedData.region}, _self.receiveResultMember)
        } else {
            services.getMCService('ShowOrg',{token:store.userToken}, _self.receiveResult)
            poolServices.showOrgCloudletPool('ShowOrgCloudletPool', {token:store.userToken}, _self.receiveResultLinkOrg)
        }


    }

    countJoin(data) {
        let updateType = this.props.updateType
        let fieldValue = []
        if(updateType === 'cloudlet'){
            let cloudletList = [];
            data.map((list) => {
                cloudletList.push({region:list['Region'], cloudlet:list['CloudletName'], orgaName:list['Operator']})
            })
            fieldValue = [{
                'Region':this.state.selectedData['region'] || '',
                'poolName':this.state.selectedData['poolName'] || '',
                'AddCloudlet':cloudletList,
                'invisibleField':''
            }]
        } else {
            let orgList = [];
            data.map((list) => {
                orgList.push({'cloudlet':list['Name']})
            })
            fieldValue = [{
                'Region':this.state.selectedData['region'] || '',
                'poolName':this.state.selectedData['poolName'] || '',
                'invisibleField':'',
                'CloudletPool':'',
                'LinktoOrganization':orgList,
                'LinkDiagram':''
            }]
        }

        console.log('20200104 props appLaunch .. poolList =-- ', fieldValue)
        //
        let panelParams = {data:fieldValue, keys:this.props.keys, region:this.state.selectedData['region']}
        _self.setState({devData:panelParams})

    }

    componentDidMount() {
        //this.handleInitialize();
        this.getDataList();
    }

    componentWillReceiveProps(nextProps) {
        let regions = [];
        let fieldValue = [];
        if(this.props.toggleSubmit) {
            this.props.dispatch(stopSubmit('orgaStepOne',{}))
        }

        if(nextProps.selectedData && nextProps.selectedData.region && nextProps.selectedData.poolName) {
            let assObj = Object.assign([], nextProps.data);
            this.setState({selectedData: nextProps.selectedData})
        }
    }

    //data:data, keys:keysData, region:region
    // data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} onSubmit={() => console.log('submit form')}
    render (){
        console.log("20200109_2 " + JSON.stringify(this.state.selectListData))
        const { handleSubmit, reset, org, type } = this.props;
        return (
            <Fragment>
                <Grid>
                    <Grid.Column>
                        <div><SiteFourCreatePoolForm data={this.state.devData}  pId={2} getUserRole={this.props.userrole} gotoUrl={this.props.gotoUrl} toggleSubmit={this.props.toggleSubmit} validError={this.props.error || []} onSubmit={() => console.log('submit form')} changeNext={'201'} selectListData = {this.state.selectListData}/></div>
                    </Grid.Column>
                </Grid>
            </Fragment>
        )

    }
};


export default SiteFourPoolUpdateView;
