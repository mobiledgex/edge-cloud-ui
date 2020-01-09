import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import * as servicePool from '../services/service_cloudlet_pool';
import SiteFourPoolUpdateView from "../container/siteFourPoolUpdateView";
import * as reducer from '../utils'
import './siteThree.css';

const createFormat = (data) => (
    {
        "region":data['Region'],
        "cloudletpool":{"key": {"name":data['poolName']}}
    }
)
const keys = [

    // {
    //     'Region':{label:'Region', type:'RenderInput', necessary:true, tip:'Select region where you want to deploy.', active:true, readOnly:true, items:[]},
    //     'poolName':{label:'Pool Name', type:'RenderInput', necessary:true, tip:'Name of the cloudlet pool.', active:true, readOnly:true, items:[]},
    //     'LinktoOrganization':{label:'Link an Organization to Pool', type:'RenderDualListBox', necessary:true, tip:'Select an orgization in left side', active:true},
    //     'invisibleField':{label:'invisible field', type:'InvisibleField', necessary:true, tip:'', active:true}
    // }
    {
        'Region':{label:'Region', type:'RenderInput', necessary:true, tip:'Select region where you want to deploy.', active:true, items:[]},
        'poolName':{label:'Pool Name', type:'RenderInput', necessary:true, tip:'Name of the cloudlet pool.', active:true, items:[]},
        'AddCloudlet':{label:'Add cloudlet', type:'RenderDualListBox', necessary:true, tip:'select a cloudlet', active:true},
        'invisibleField':{label:'invisible field', type:'InvisibleField', necessary:true, tip:'', active:true},
    }
]
let _self = null;

class SiteFourPageCloudletPoolUpdate extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight:0,
            contWidth:0,
            bodyHeight:0,
            activeItem: 'Developers',
            data:[],
            cloudlets:[],
            operators:[],
            clustinst:[],
            apps:[],
            selectedRegion:null,
            typeOperator:'Developer',
            updateType: 'cloudlet',
            orgaName:'',
            gavePoolName:'',
            keys: keys
        };
        this.headerH = 70;
        this.hgap = 0;
        this.userToken = null;
        this.pauseRender = false;
    }

    //go to
    gotoPreview(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    receiveResultCloudlet = (result) => {
        console.log('20200107 result -- ',JSON.stringify(result))

        if(result.error) {
            //this.setState({clusterInstCreate:false})
            this.props.handleLoadingSpinner(false);
            if(result.error == 'Key already exists'){

            } else {
                this.props.handleAlertInfo('error','Request Failed')
            }
        } else {
            if (result.data.error) {
                this.props.handleAlertInfo('error', result.data.error)
            } else {
                this.props.handleAlertInfo('success',result.data.message)
                setTimeout(()=> this.gotoUrl(), 3000);
            }
        }
        this.pauseRender = false;
    }

    componentWillMount() {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        this.setState({data:{}})
        //TODO: 편집 기능 - 오거나이제이션 링크된것과 새로 등록할 오거나이를 좌, 우측 리스트박스에 넣기
    }
    componentWillReceiveProps(nextProps) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        this.setState({submitValues: nextProps.formClusterInst.values})
        /** when click context menu there positioned right on the list**/
        if(nextProps.appLaunch){
            console.log('20200106 app launch props.. ', nextProps.appLaunch)
            let props = nextProps.appLaunch.data;
            this.setState({selectedRegion:props['Region'], gavePoolName:props['PoolName']})
        }
        //if(nextProps.formClusterInst.values === this.state.submitValues) return;
        if(nextProps.formClusterInst && nextProps.formClusterInst.submitSucceeded){
            /**
             * $ http --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/orgcloudletpool/create <<<
             * '{"cloudletpool":"cloudletPool_bictest_1223-01","org":"bicinkiOper","region":"EU"}'
             * @type {{}}
             * @private
             */
            if(this.pauseRender) return;
            let _params = {};
            let selectedNumber = JSON.parse(nextProps.formClusterInst.values.invisibleField);
            let cloudletPool = nextProps.formClusterInst.values.poolName;
            let region = nextProps.formClusterInst.values.Region;
            console.log('20200106 create link pool org.. ', region,":", cloudletPool, ":", selectedNumber)
            if(selectedNumber.length) {
                this.pauseRender = true;
                let cloudlet = ''
                selectedNumber.map((no) => {
                    cloudlet = nextProps.formClusterInst.values.AddCloudlet[no];
                    // _params = {"poolName":cloudletPool,"cloudlet":cloudlets['cloudlet'],"region":region}

                    _params = {
                        "cloudletpoolmember":{
                            "cloudlet_key":{
                                "name":cloudlet.cloudlet,
                                "operator_key":{
                                    "name":cloudlet.orgaName
                                }
                            },
                            "pool_key":{
                                "name":nextProps.formClusterInst.values.poolName
                            }
                        },
                        "region":cloudlet.region
                    }
                    servicePool.createCloudletPoolMember('CreateCloudletPoolMember',{token:store.userToken, params:_params}, _self.receiveResultCloudlet, 0)
                })
            }
        }

    }

    gotoUrl() {
        _self.props.history.push({
            pathname: '/site4',
            search: 'pg=7'
        });
        _self.props.history.location.search = 'pg=7';
        _self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=7'})
    }

    changeOrg() {

    }


    /*
     */
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { typeOperator, data, orgaName,gavePoolName,selectedRegion } = this.state;
        const {toggleSubmit} = this.props;
        return (
            <div className="round_panel">
                <div className="grid_table" style={{overflow:'auto'}}>
                    <SiteFourPoolUpdateView onSubmit={() => console.log('Form was submitted')} type={typeOperator} org={orgaName} toggleSubmitTwo={this.props.toggleSubmitTwo} selectedData={{region:this.props.appLaunch.data.Region, poolName:gavePoolName}} changeOrg={this.changeOrg} keys={this.state.keys} updateType={this.state.updateType}></SiteFourPoolUpdateView>
                </div>
            </div>

        );
    }

};
const mapStateToProps = (state) => {
    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    let appLaunch = (state.appLaunch)?state.appLaunch:null;
    let submitValues = null;
    let validateValue = {};
    if(state.form.createAppFormDefault && state.form.createAppFormDefault.values && state.form.createAppFormDefault.submitSucceeded) {
        let enableValue = reducer.filterDeleteKey(state.form.createAppFormDefault.values, 'Edit')
        submitValues = createFormat(enableValue,state.getRegion.region);
        validateValue = state.form.createAppFormDefault.values;
    }
    let formClusterInst= state.form.createAppFormDefault
        ? {
            values: state.form.createAppFormDefault.values,
            submitSucceeded: state.form.createAppFormDefault.submitSucceeded
        }
        : {};
    return {

        region,
        appLaunch,
        submitValues,
        validateValue,
        formClusterInst


    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleInjectFlavor: (data) => { dispatch(actions.showFlavor(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourPageCloudletPoolUpdate));
