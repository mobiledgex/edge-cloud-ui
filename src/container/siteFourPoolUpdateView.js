import React, { Fragment } from "react";
import {Grid} from "semantic-ui-react";
import {stopSubmit} from "redux-form";
import SiteFourCreatePoolForm  from './siteFourCreatePoolForm';
import * as serviceMC from '../services/serviceMC';
import './styles.css';

let _self = null;
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
        console.log('20191231 show cloudlet result -- ', result)

        if(result.response){
            if(result.response.data && result.response.data.length) {
                _self.countJoin(result.response.data)
            } else if(result && result.length){
                _self.countJoin(result)
            }
        }
    }

    receiveResultMember = (result) => {
        let cloudletData = [];
        let poolName = this.state.selectedData['poolName']
        if(result.response){
            if(result.response.data && result.response.data.length) {
                result.response.data.map((item) =>{
                    if(poolName === item.PoolName){
                        cloudletData.push(item.Cloudlet)
                    }
                })
            }
        }
        this.setState({selectListData: cloudletData});
        this.props.filterOldData(cloudletData);
    }

    receiveResultLinkOrg = (result) => {
        let orgData = [];
        let poolName = this.state.selectedData['poolName']
        if(result.response){
            if(result.response.data && result.response.data.length) {
                result.response.data.map((item) =>{
                    if(poolName === item.CloudletPool){
                        orgData.push(item['Org'])
                    }
                })
            }
        }
        this.setState({selectListData: orgData});
        this.props.filterOldData(orgData);
    }

    getDataList = () => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData:[]})
        let updateType = this.props.updateType;
        if(updateType === 'cloudlet'){
            // services.getMCService('ShowCloudlet',{token:store.userToken, region:this.props.selectedData.region}, _self.receiveResult)
            let requestDataShowCloudlet = {token:store.userToken, method:serviceMC.getEP().SHOW_CLOUDLET, data : {region:this.props.selectedData.region}};
            serviceMC.sendRequest(_self, requestDataShowCloudlet, _self.receiveResult)
            // poolServices.getListCloudletPoolMember('ShowCloudletPoolMember',{token:store.userToken, region:this.props.selectedData.region}, _self.receiveResultMember)
            let requestDataMember = {token:store.userToken, method:serviceMC.getEP().SHOW_CLOUDLET_MEMBER, data : {region:this.props.selectedData.region}};
            serviceMC.sendRequest(_self, requestDataMember, _self.receiveResultMember)
        } else {
            // services.getMCService('ShowOrg',{token:store.userToken}, _self.receiveResultLinkOrg)
            let requestDataShowOra = {token:store.userToken, method:serviceMC.getEP().SHOW_ORG, data : {}};
            serviceMC.sendRequest(_self, requestDataShowOra, _self.receiveResult)
            // poolServices.showOrgCloudletPool('ShowOrgCloudletPool', {token:store.userToken}, _self.receiveResultLinkOrg)
            let requestDataOrg = {token:store.userToken, method:serviceMC.getEP().SHOW_CLOUDLET_LINKORG, data : {}};
            serviceMC.sendRequest(_self, requestDataOrg, _self.receiveResultLinkOrg)
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
                orgList.push({'cloudlet':list['Organization']})
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

    render (){
        return (
            <Fragment>
                <Grid>
                    <Grid.Column>
                        <div><SiteFourCreatePoolForm data={this.state.devData} editMode={true} pId={2} getUserRole={this.props.userrole} gotoUrl={this.props.gotoUrl} toggleSubmit={this.props.toggleSubmit} validError={this.props.error || []} onSubmit={() => console.log('submit form')} changeNext={'201'} selectListData = {this.state.selectListData}/></div>
                    </Grid.Column>
                </Grid>
            </Fragment>
        )

    }
};


export default SiteFourPoolUpdateView;
