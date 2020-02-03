import React, { Fragment } from "react";
import {Button, Form, Item, Message, List, Grid, Card, Header, Image, Input} from "semantic-ui-react";
import {Field, reduxForm, initialize, reset, stopSubmit} from "redux-form";
import SiteFourCreatePoolForm  from './siteFourCreatePoolForm';
import * as serviceMC from '../services/serviceMC';
import './styles.css';

let _self = null;
const keys = [

    {
        'Region':{label:'Region', type:'RenderInput', necessary:true, tip:'Select region where you want to deploy.', active:true, readOnly:true, items:[]},
        'poolName':{label:'Pool Name', type:'RenderInput', necessary:true, tip:'Name of the cloudlet pool.', active:true, readOnly:true, items:[]},
        'LinktoOrganization':{label:'Link an Organization to Pool', type:'RenderDualListBox', necessary:true, tip:'Select an orgization in left side', active:true},
        'invisibleField':{label:'invisible field', type:'InvisibleField', necessary:true, tip:'', active:true}
    }
    ]

class SiteFourPoolTwo extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            typeValue:'',
            propsData:[],
            selectedData:[]
        };

    }

    handleInitialize() {
        let cType = this.props.type.substring(0,1).toUpperCase() + this.props.type.substring(1);
        const initData = {
            "orgName": this.props.org,
            "orgType": cType
        };

        this.props.initialize(initData);
    }

    receiveResultOrg = (mcRequest) => {
        // console.log('20191231 show org result -- ', result)

        // if(result.data && result.data.length) {
        //     _self.countJoinOrg(result.data)
        // }

        if(mcRequest)
        {
            if(mcRequest.response)
            {
                let response = mcRequest.response;
                if (response.data.length == 0) {
                    _self.setState({ devData: [] })
                    _self.props.handleDataExist(false)
                    _self.props.handleAlertInfo('error', 'There is no data')
                } else {
                    //_self.setState({ devData: response.data })
                    _self.countJoinOrg(response.data)
                    _self.props.handleDataExist(true)
                }
            }
        }      
        _self.props.handleLoadingSpinner(false);

    }
    getDataOrgaList = () => {
        this.setState({devData:[]})
        // old
        //services.getMCService('ShowOrg',{token:store.userToken}, _self.receiveResultOrg)
        // new
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        serviceMC.sendRequest(_self, { token: store ? store.userToken : 'null', method: serviceMC.getEP().SHOW_ORG }, _self.receiveResultOrg)

    }
    countJoinOrg(orgs) {
        let orgList = [];
        orgs.map((list) => {
            orgList.push({'cloudlet':list['Organization']})
        })

        //
        let fieldValue = [{
            'Region':this.state.selectedData['region'] || '',
            'poolName':this.state.selectedData['poolName'] || '',
            'LinktoOrganization':orgList,
            'invisibleField':'',
            'CloudletPool':'',
            'LinkDiagram':''
        }]

        console.log('20200104 props appLaunch .. orgList =-- ', fieldValue)
        //
        let panelParams = {data:fieldValue, keys:keys, region:''}
        _self.setState({devData:panelParams})

    }

    componentDidMount() {
        //this.handleInitialize();

        this.getDataOrgaList();
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
        const { handleSubmit, reset, org, type, step } = this.props;
        return (
            <Fragment>
                <Grid>
                    <Grid.Column>
                        <div><SiteFourCreatePoolForm data={this.state.devData} step={step} pId={2} getUserRole={this.props.userrole} gotoUrl={this.props.gotoUrl} toggleSubmit={this.props.toggleSubmit} validError={this.props.error || []} onSubmit={() => console.log('submit form')} changeNext={'201'} editMode={this.props.editMode ? this.props.editMode : null}/></div>
                    </Grid.Column>
                </Grid>
            </Fragment>
        )

    }
};


export default SiteFourPoolTwo;
