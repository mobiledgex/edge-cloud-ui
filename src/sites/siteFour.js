import React from 'react';
import {Grid, Image, Header, Menu, Dropdown, Button, Popup, Divider, Modal, Item} from 'semantic-ui-react';
import sizeMe from 'react-sizeme';

import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import ContainerDimensions from 'react-container-dimensions'
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import './siteThree.css';
//pages
import SiteFourPageZero from './siteFour_page_zero';
import SiteFourPageOne from './siteFour_page_one';
import SiteFourPageTwo from './siteFour_page_two';
import SiteFourPageThree from './siteFour_page_three';
import SiteFourPageFour from './siteFour_page_four';
import SiteFourPageFive from './siteFour_page_five';
import SiteFourPageSix from './siteFour_page_six';
import SiteFourPageSeven from './siteFour_page_seven';

import SiteFourPageFlavor from './siteFour_page_flavor';
import SiteFourPageUser from './siteFour_page_user';
import SiteFourPageCluster from './siteFour_page_cluster';
import SiteFourPageApps from './siteFour_page_apps';
import SiteFourPageAppInst from './siteFour_page_appinst';
import SiteFourPageClusterInst from './siteFour_page_clusterinst';
import SiteFourPageCloudlet from './siteFour_page_cloudlet';
import SiteFourPageOrgabuzation from './siteFour_page_organization';
import SiteFourCreateOper from '../container/siteFourCreateOper';

import { LOCAL_STRAGE_KEY } from '../components/utils/Settings';

import * as Service from '../services/service_login_api';
import * as computeService from '../services/service_compute_service';

import PopProfileViewer from '../container/popProfileViewer';

let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]
const locationOptions = [
    { key: 'Arabic', text: 'Arabic', value: 'Arabic' },
    { key: 'Chinese', text: 'Chinese', value: 'Chinese' },
    { key: 'Danish', text: 'Danish', value: 'Danish' },
    { key: 'Dutch', text: 'Dutch', value: 'Dutch' },
    { key: 'English', text: 'English', value: 'English' },
    { key: 'French', text: 'French', value: 'French' },
    { key: 'German', text: 'German', value: 'German' },
    { key: 'Greek', text: 'Greek', value: 'Greek' },
    { key: 'Hungarian', text: 'Hungarian', value: 'Hungarian' },
    { key: 'Italian', text: 'Italian', value: 'Italian' },
    { key: 'Japanese', text: 'Japanese', value: 'Japanese' },
    { key: 'Korean', text: 'Korean', value: 'Korean' },
    { key: 'Lithuanian', text: 'Lithuanian', value: 'Lithuanian' },
    { key: 'Persian', text: 'Persian', value: 'Persian' },
    { key: 'Polish', text: 'Polish', value: 'Polish' },
    { key: 'Portuguese', text: 'Portuguese', value: 'Portuguese' },
    { key: 'Russian', text: 'Russian', value: 'Russian' },
    { key: 'Spanish', text: 'Spanish', value: 'Spanish' },
    { key: 'Swedish', text: 'Swedish', value: 'Swedish' },
    { key: 'Turkish', text: 'Turkish', value: 'Turkish' },
    { key: 'Vietnamese', text: 'Vietnamese', value: 'Vietnamese' },
]
const options = [
    {
        key: 'local',
        text: 'local',
        value: 'local',
        content: 'local',
    },
    {
        key: 'US',
        text: 'US',
        value: 'US',
        content: 'US',
    },
    {
        key: 'EU',
        text: 'EU',
        value: 'EU',
        content: 'EU',
    },
]
let _self = null;
class SiteFour extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight:0,
            contWidth:0,
            bodyHeight:0,
            headerTitle:'',
            activeItem: 'Organization',
            page: 'pg=org',
            email: store ? store.email : 'Administrator',
            role:'', //db에서
            onlyView: false,
            userToken:null,
            profileViewData:null,
            openProfile:false,
            userName:'',
            controllerRegions:null
        };
        this.headerH = 70;
        this.hgap = 0;
        this.menuItems = [
            {label:'Organization', icon:'people', pg:'org'},
            {label:'Flavor', icon:'free_breakfast', pg:0},
            {label:'Cluster Flavor', icon:'developer_board', pg:1},
            {label:'Users', icon:'dvr', pg:2},
            {label:'Cloudlets', icon:'cloud_queue', pg:3},
            {label:'Cluster Instances', icon:'storage', pg:4},
            {label:'Apps', icon:'apps', pg:5},
            {label:'App Instances', icon:'storage', pg:6}
        ]
        // this.auth_one = [this.menuItems[0], this.menuItems[1], this.menuItems[2], this.menuItems[3], this.menuItems[4], this.menuItems[5], this.menuItems[6], this.menuItems[7]] //MEXADMIN
        // this.auth_two = [this.menuItems[0], this.menuItems[1], this.menuItems[2], this.menuItems[3], this.menuItems[4], this.menuItems[5], this.menuItems[6], this.menuItems[7]] //DeveloperManager, DeveloperContributor, DeveloperViewer
        this.auth_three = [this.menuItems[2], this.menuItems[3]] //OperatorManager, OperatorContributor, OperatorViewer
        this.auth_list = [
            {role:'MEXADMIN', view:[]},
            {role:'superadmin', view:[]},
            {role:'Developer Manager', view:[0,1,3]},
            {role:'Developer Contributor', view:[0,1,2,3]},
            {role:'Developer Viewer', view:[0,1,2,3,4,5,6]},
            {role:'Operator Manager', view:[]},
            {role:'Operator Contributor', view:[2]},
            {role:'Operator Viewer', view:[2,3]},
        ]
    }
    PopupExampleFlowing = () => (
        <Popup trigger={<Button>Show flowing popup</Button>} flowing hoverable>
            <Grid centered divided columns={3}>
                <Grid.Column textAlign='center'>
                    <Header as='h4'>Basic Plan</Header>
                    <p>
                        <b>2</b> projects, $10 a month
                    </p>
                    <Button>Choose</Button>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                    <Header as='h4'>Business Plan</Header>
                    <p>
                        <b>5</b> projects, $20 a month
                    </p>
                    <Button>Choose</Button>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                    <Header as='h4'>Premium Plan</Header>
                    <p>
                        <b>8</b> projects, $25 a month
                    </p>
                    <Button>Choose</Button>
                </Grid.Column>
            </Grid>
        </Popup>
    )

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
        _self.props.handleChangeViewBtn(false)
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})
        _self.props.handleChangeClickCity([]);

    }
    handleItemClick ( id, label, pg, role ) {
        _self.props.handleChangeViewBtn(false);
        _self.props.handleChangeClickCity([]);
        _self.props.handleChangeComputeItem(label);
        this.auth_list.map((item) => {
            if(item.role == role) {
                item.view.map((item) => {
                    if(item == pg){
                        _self.props.handleChangeViewBtn(true)
                    }
                })
            }
        });
        _self.props.history.push({
            pathname: '/site4',
            search: "pg="+pg
        });
        _self.props.history.location.search = "pg="+pg;
        this.setState({ page:'pg='+pg, activeItem: label, headerTitle:label })
    }

    onHandleRegistry() {
        if(this.state.activeItem === 'Organization') {

            this.setState({page:'pg=newOrg'})
        } else {

            this.props.handleInjectDeveloper('newRegist');
        }
    }
    receiveCurrentUser(result) {
        console.log('receive user info ---', result.data)
        _self.props.handleUserInfo(result.data);
    }
    receiveResult(result) {
        console.log("controllerList",result.data);
        //this.setState({ controllerRegions:result.data })
        _self.setState({controllerRegions: result.data})
    }
    controllerOptions(option){
        let arr = []
        if(option.controllerRegions) {
            option.controllerRegions.map((item)=> {
                arr.push({
                    key: item.Region,
                    text: item.Region,
                    value: item.Region,
                    content: item.Region
                })
            })
        }
        return arr;
    }
    menuAdmin = () => (
        <Button.Group vertical>
            <Button onClick={() => this.profileView()} >Your profile</Button>
            <Button style={{height:10, padding:0, margin:0}}><Divider inverted style={{padding:2, margin:0}}></Divider></Button>
            <Button style={{color:'#333333'}}>Help</Button>
            <Button style={{}} onClick={() => this.gotoPreview('/logout')}><div>{this.state.userName}</div><div>Logout</div></Button>
        </Button.Group>

    )
    menuAddItem = () => (
        <Button.Group vertical>

            <Modal trigger={<Button>Create Control</Button>} centered={false}>
                <Modal.Header>Select a Photo</Modal.Header>
                <Modal.Content image>
                    <Image wrapped size='medium' src='/images/avatar/large/rachel.png' />
                    <Modal.Description>
                        <Header>Default Profile Image</Header>
                        <p>We've found the following gravatar image associated with your e-mail address.</p>
                        <p>Is it okay to use this photo?</p>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
            <Button>Create User</Button>
            <Button>New Organization</Button>
        </Button.Group>

    )
    openModalCreate() {

    }
    componentWillMount() {
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        console.log('info.. ', this.childFirst, this.childSecond)
        this.setState({activeItem:'Organization', headerTitle:'Organization', role:store.user.role})
        //get list of customer's info
        if(store.userToken) {
            Service.getCurrentUserInfo('currentUser', {token:store.userToken}, this.receiveCurrentUser, this);
            computeService.getMCService('showController', {token:store.userToken}, this.receiveResult, this);
        }
        
    }
    componentWillReceiveProps(nextProps) {
        console.log("props!!!!",nextProps)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        this.setState({userToken: nextProps.userToken})
        this.setState({userName: nextProps.userInfo.info.Name})

    }


    //close profile popup
    closeProfile = () => {
        this.setState({ openProfile: false })
    }

    profileView() {
        this.setState({openProfile:true})
    }

    //compute page menu view
    menuItemView = (item, i, activeItem) => (
        <Menu.Item
            name={item.label}
            active={activeItem === item.label}
            onClick={() => this.handleItemClick(i, item.label, item.pg, this.state.role)}
        >
            <div className="left_menu_item">
                <MaterialIcon icon={item.icon}/>
                <div className='label'>{item.label}</div>
            </div>
        </Menu.Item>
    )

    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem, controllerRegions } = this.state
        return (
            <Grid className='view_body'>
                <Grid.Row className='gnb_header'>
                    <Grid.Column width={10} className='navbar_left'>
                        <Header>
                            <Header.Content onClick={() => this.gotoPreview('/site1')}  className='brand' />
                        </Header>
                    </Grid.Column>
                    <Grid.Column width={6} className='navbar_right'>
                        <div style={{cursor:'pointer'}} onClick={() => this.gotoPreview('/site1')}>
                            <MaterialIcon icon={'public'} />
                        </div>
                        <div style={{cursor:'pointer'}} onClick={() => console.log('')}>
                            <MaterialIcon icon={'notifications_none'} />
                        </div>

                        <Popup
                            trigger={<div style={{cursor:'pointer'}} onClick={() => console.log('')}>
                                <MaterialIcon icon={'add'} />
                            </div>}
                            content={this.menuAddItem()}
                            on='click'
                            position='bottom center'
                            className='gnb_logout'
                        />
                        <Popup
                            trigger={<div style={{cursor:'pointer'}}>
                                <Image src='/assets/avatar/avatar_default.svg' avatar />
                                <span>{this.state.email}</span>
                            </div>}
                            content={this.menuAdmin()}
                            on='click'
                            position='bottom center'
                            className='gnb_logout'
                        />
                        <div>
                            <span>Support</span>
                        </div>

                        <PopProfileViewer data={this.props.userInfo.info} dimmer={false} open={this.state.openProfile} close={this.closeProfile}></PopProfileViewer>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} className='view_contents'>
                    <Grid.Column width={2} className='view_left'>
                        <Menu secondary vertical className='view_left_menu'>
                            {
                                (this.state.role == 'MEXADMIN' || this.state.role == 'superuser')?
                                    this.menuItems.map((item, i)=>(
                                        this.menuItemView(item, i, activeItem)
                                    ))
                                :
                                (this.state.role == 'Developer Manager' || this.state.role == 'Developer Contributor' || this.state.role == 'Developer Viewer')?
                                    this.menuItems.map((item, i)=>(
                                        this.menuItemView(item, i, activeItem)
                                    ))
                                :
                                (this.state.role == 'Operator Manager' || this.state.role == 'Operator Contributor' || this.state.role == 'Operator Viewer')?
                                    this.auth_three.map((item, i)=>(
                                        this.menuItemView(item, i, activeItem)
                                    ))
                                :
                                <div></div>
                            }
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={14} style={{height:this.state.bodyHeight}} className='contents_body'>
                        <Grid.Row className='content_title'>
                            <Grid.Column className='title_align'>{this.state.headerTitle}</Grid.Column>
                            <Grid.Column className='title_align'>
                                <Item style={{marginLeft:20}}>
                                    <Button color='teal' disabled={this.props.viewBtn.onlyView} onClick={() => this.onHandleRegistry()}>New</Button>
                                </Item>
                            </Grid.Column>
                        </Grid.Row>
                        <div style={{top:30, left:300, position:'absolute'}}>
                            <Dropdown
                                options={this.controllerOptions({controllerRegions})}
                                defaultValue={options[1].value}
                            />
                        </div>
                        <Grid.Row className='site_content_body' style={{height:'100%'}}>
                            <Grid.Column style={{height:'100%'}}>
                                <ContainerDimensions>
                                    { ({ width, height }) =>
                                        <div style={{width:width, height:height, display:'flex', overflow:'hidden'}}>
                                            {
                                                (this.state.page === 'pg=org')?<SiteFourPageOrgabuzation userToken={this.state.userToken}></SiteFourPageOrgabuzation> :
                                                (this.state.page === 'pg=0')?<SiteFourPageFlavor></SiteFourPageFlavor> :
                                                (this.state.page === 'pg=1')?<SiteFourPageCluster></SiteFourPageCluster> :
                                                (this.state.page === 'pg=2')?<SiteFourPageUser></SiteFourPageUser> : // 페이지 설정 안됨
                                                (this.state.page === 'pg=3')?<SiteFourPageCloudlet></SiteFourPageCloudlet> :
                                                (this.state.page === 'pg=4')?<SiteFourPageClusterInst></SiteFourPageClusterInst>:
                                                (this.state.page === 'pg=5')?<SiteFourPageApps></SiteFourPageApps>:
                                                (this.state.page === 'pg=6')? <SiteFourPageAppInst></SiteFourPageAppInst> :
                                                (this.state.page === 'pg=newOrg')? <SiteFourCreateOper></SiteFourCreateOper> : <div> </div>

                                            }
                                        </div>
                                    }
                                </ContainerDimensions>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

};

const mapStateToProps = (state) => {
    console.log('props in siteFour..', state)
    return {
        viewBtn : state.btnMnmt,
        userToken : (state.userToken) ? state.userToken: null,
        userInfo : state.userInfo
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleChangeViewBtn: (data) => { dispatch(actions.btnManagement(data))},
        handleChangeComputeItem: (data) => { dispatch(actions.computeItem(data))},
        handleChangeClickCity: (data) => { dispatch(actions.clickCityList(data))},
        handleUserInfo: (data) => { dispatch(actions.userInfo(data))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFour)));

