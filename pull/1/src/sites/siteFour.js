import React from 'react';
import {
    Grid,
    Image,
    Header,
    Menu,
    Dropdown,
    Button,
    Popup,
    Divider,
    Modal,
    Item,
    Input,
    Segment,
    Table
} from 'semantic-ui-react';
import sizeMe from 'react-sizeme';

import {withRouter} from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import ContainerDimensions from 'react-container-dimensions'
import {Motion, spring} from "react-motion";
//redux
import {connect} from 'react-redux';
import * as actions from '../actions';
import './siteThree.css';

//pages
import SiteFourPageFlavor from './siteFour_page_flavor';
import SiteFourPageUser from './siteFour_page_user';
import SiteFourPageCluster from './siteFour_page_cluster';
import SiteFourPageApps from './siteFour_page_apps';
import SiteFourPageAppInst from './siteFour_page_appinst';
import SiteFourPageClusterInst from './siteFour_page_clusterinst';
import SiteFourPageCloudlet from './siteFour_page_cloudlet';
import SiteFourPageOrganization from './siteFour_page_organization';

import SiteFourPageCreateorga from './siteFour_page_createOrga';

import {LOCAL_STRAGE_KEY} from '../components/utils/Settings';
import * as Service from '../services/service_login_api';

import * as computeService from '../services/service_compute_service';
import PopProfileViewer from '../container/popProfileViewer';

let devOptions = [{key: 'af', value: 'af', text: 'SK Telecom'}]
const locationOptions = [
    {key: 'Arabic', text: 'Arabic', value: 'Arabic'},
    {key: 'Chinese', text: 'Chinese', value: 'Chinese'},
    {key: 'Danish', text: 'Danish', value: 'Danish'},
    {key: 'Dutch', text: 'Dutch', value: 'Dutch'},
    {key: 'English', text: 'English', value: 'English'},
    {key: 'French', text: 'French', value: 'French'},
    {key: 'German', text: 'German', value: 'German'},
    {key: 'Greek', text: 'Greek', value: 'Greek'},
    {key: 'Hungarian', text: 'Hungarian', value: 'Hungarian'},
    {key: 'Italian', text: 'Italian', value: 'Italian'},
    {key: 'Japanese', text: 'Japanese', value: 'Japanese'},
    {key: 'Korean', text: 'Korean', value: 'Korean'},
    {key: 'Lithuanian', text: 'Lithuanian', value: 'Lithuanian'},
    {key: 'Persian', text: 'Persian', value: 'Persian'},
    {key: 'Polish', text: 'Polish', value: 'Polish'},
    {key: 'Portuguese', text: 'Portuguese', value: 'Portuguese'},
    {key: 'Russian', text: 'Russian', value: 'Russian'},
    {key: 'Spanish', text: 'Spanish', value: 'Spanish'},
    {key: 'Swedish', text: 'Swedish', value: 'Swedish'},
    {key: 'Turkish', text: 'Turkish', value: 'Turkish'},
    {key: 'Vietnamese', text: 'Vietnamese', value: 'Vietnamese'},
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
let defaultMotion = {left: window.innerWidth / 2, top: window.innerHeight / 2, position: 'absolute', opacity: 1}
let _self = null;

class SiteFour extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight: 0,
            contWidth: 0,
            bodyHeight: 0,
            headerTitle: '',
            activeItem: 'Organization',
            page: 'pg=0',
            email: store ? store.email : 'Administrator',
            role: 'MEXADMIN', //db에서
            onlyView: false,
            userToken: null,
            profileViewData: null,
            openProfile: false,
            userName: '',
            controllerRegions: null,
            regions: [],
            nextPosX: window.innerWidth / 2,
            nextPosY: window.innerHeight / 2,
            nextOpacity: 1,
            setMotion: defaultMotion,
            OrganizationName: '-'

        };
        //this.controllerOptions({controllerRegions})
        this.headerH = 70;
        this.hgap = 0;
        this.OrgMenu = [
            {label: 'Organization', icon: 'people', pg: 0},
            {label: 'Users', icon: 'dvr', pg: 1}
        ]
        this.menuItems = [
            {label: 'Cloudlets', icon: 'cloud_queue', pg: 2},
            {label: 'Flavor', icon: 'free_breakfast', pg: 3},
            {label: 'Cluster Flavor', icon: 'developer_board', pg: 4},
            {label: 'Cluster Instances', icon: 'storage', pg: 5},
            {label: 'Apps', icon: 'apps', pg: 6},
            {label: 'App Instances', icon: 'storage', pg: 7}
        ]
        this.auth_three = [this.menuItems[0], this.menuItems[1], this.menuItems[2]] //OperatorManager, OperatorContributor, OperatorViewer
        this.auth_default = [{label: 'Organization', icon: 'people', pg: 0}]
        this.auth_list = [
            {role: 'MEXADMIN', view: []},
            {role: 'superadmin', view: []},
            {role: 'DeveloperManager', view: [2, 3, 4]},
            {role: 'DeveloperContributor', view: [1, 2, 3, 4]},
            {role: 'DeveloperViewer', view: [1, 2, 3, 4, 5, 6, 7]},
            {role: 'OperatorManager', view: []},
            {role: 'OperatorContributor', view: [1]},
            {role: 'OperatorViewer', view: [1, 2]}
        ]
        this.searchOptions = [
            {
                key: 'UserName',
                text: 'UserName',
                value: 'UserName'
            },
            {
                key: 'Organization',
                text: 'Organization',
                value: 'Organization'
            },
            {
                key: 'TypeRole',
                text: 'TypeRole',
                value: 'TypeRole'
            },
        ]

        this.speed = {stiffness: 500, damping: 100}
        this.speedOpacity = {stiffness: 500, damping: 100}
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
            state: {some: 'state'}
        });
        _self.props.handleChangeViewBtn(false)
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath: mainPath, subPath: subPath})
        _self.props.handleChangeClickCity([]);

    }

    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
    }

    handleItemClick(id, label, pg, role) {
        _self.props.handleChangeViewBtn(false);
        _self.props.handleChangeClickCity([]);
        _self.props.handleChangeComputeItem(label);
        this.auth_list.map((item) => {
            if (item.role == role) {
                item.view.map((item) => {
                    if (item == pg) {
                        _self.props.handleChangeViewBtn(true)
                    }
                })
            }
        });
        _self.props.history.push({
            pathname: '/site4',
            search: "pg=" + pg
        });
        _self.props.history.location.search = "pg=" + pg;
        this.setState({page: 'pg=' + pg, activeItem: label, headerTitle: label})
    }

    onHandleRegistry() {
        if (this.state.activeItem === 'Organization') {

            this.setState({page: 'pg=newOrg'})
            this.gotoUrl('/site4', 'pg=newOrg')
        } else {

            this.props.handleInjectDeveloper('newRegist');
        }
    }

    receiveCurrentUser(result) {
        console.log('receive user info ---', result.data)
        _self.props.handleUserInfo(result.data);
    }

    receiveResult(result) {
        console.log("controllerList", result.data);
        //this.setState({ controllerRegions:result.data })
        _self.controllerOptions(result.data);
    }

    controllerOptions(option) {
        let arr = []
        if (option) {
            option.map((item) => {
                arr.push({
                    key: item.Region,
                    text: item.Region,
                    value: item.Region,
                    content: item.Region
                })
            })
        }
        _self.setState({regions: arr})
    }

    menuAdmin = () => (
        <Button.Group vertical>
            <Button onClick={() => this.profileView()}>Your profile</Button>
            {/*<Button style={{height:10, padding:0, margin:0}}><Divider inverted style={{padding:2, margin:0}}></Divider></Button>*/}
            <Button style={{color: '#333333'}}>Help</Button>
            <Button style={{}} onClick={() => this.gotoPreview('/logout')}>
                <div>{this.state.userName}</div>
                <div>Logout</div>
            </Button>
        </Button.Group>

    )
    menuAddItem = () => (
        <Button.Group vertical>

            <Modal trigger={<Button>Create Control</Button>} centered={false}>
                <Modal.Header>Select a Photo</Modal.Header>
                <Modal.Content image>
                    <Image wrapped size='medium' src='/images/avatar/large/rachel.png'/>
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
        this.setState({bodyHeight: (window.innerHeight - this.headerH)})
        this.setState({contHeight: (window.innerHeight - this.headerH) / 2 - this.hgap})
    }

    componentDidMount() {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        console.log('store.. ', store.user)
        this.setState({
            activeItem: 'Organization',
            headerTitle: 'Organization',
            role: (store.user && store.user.role) ? store.user.role : 'MEXADMIN'
        })
        //get list of customer's info
        if (store.userToken) {
            Service.getCurrentUserInfo('currentUser', {token: store.userToken}, this.receiveCurrentUser, this);
            computeService.getMCService('showController', {token: store.userToken}, this.receiveResult, this);
        }
        //if there is no role

        //show you create the organization view
        this.setState({page: 'pg=0'})
        this.gotoUrl('/site4', 'pg=0')

        setTimeout(() => {
            let elem = document.getElementById('animationWrapper')
            _self.makeGhost(elem, _self)
        }, 4000)
    }

    componentWillReceiveProps(nextProps) {
        console.log("props!!!!", nextProps)

        this.setState({bodyHeight: (window.innerHeight - this.headerH)})
        this.setState({contHeight: (nextProps.size.height - this.headerH) / 2 - this.hgap})
        this.setState({userToken: nextProps.userToken})
        this.setState({userName: (nextProps.userInfo && nextProps.userInfo.info) ? nextProps.userInfo.info.Name : null})
        if (nextProps.selectOrg && nextProps.location.search === 'pg=0') {
            console.log('nextProps.selectOr -- ', nextProps.selectOrg)
            this.resetMotion()
            setTimeout(() => _self.setState({OrganizationName: nextProps.selectOrg.Organization}), 1000)
        }
    }


    //close profile popup
    closeProfile = () => {
        this.setState({openProfile: false})
    }

    profileView() {
        this.setState({openProfile: true})
    }

    ID = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    //compute page menu view
    menuItemView = (item, i, activeItem) => (
        <Menu.Item
            name={item.label}
            active={activeItem === item.label}
            onClick={() => this.handleItemClick(i, item.label, item.pg, this.props.userRole)}
        >
            <div className="left_menu_item">
                <MaterialIcon icon={item.icon}/>
                <div className='label'>{item.label}</div>
                <div id={ID()}/>
            </div>
        </Menu.Item>
    )

    searchClick = (e) => {
        console.log(e)
    }

    makeGhost(elem, self) {

        let child = document.createElement('div')
        child.style.cssText = 'position:absolute; width:100px; height:30px; opacity:0.8; left:0px; z-index:100; background:#aaaaaa; border-radius:5px';
        child.innerHTML = '<div>CloudletName</div>'
        elem.appendChild(child);
        //
        let nextPosX = 15
        let nextPosY = 90;
        setTimeout(() => self.setState({
            setMotion: {
                left: spring(nextPosX, self.speed),
                top: spring(nextPosY, self.speed),
                position: 'absolute',
                opacity: 0
            }
        }), 200);
    }

    resetMotion() {
        let self = _self;
        this.setState({setMotion: defaultMotion})
        let nextPosX = 15
        let nextPosY = 90;
        setTimeout(() => self.setState({
            setMotion: {
                left: spring(nextPosX, self.speed),
                top: spring(nextPosY, self.speed),
                position: 'absolute',
                opacity: spring(0, self.speedOpacity)
            }
        }), 500);
    }


    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const {activeItem, controllerRegions} = this.state
        return (
            <Grid className='view_body'>
                <Grid.Row className='gnb_header'>
                    <Grid.Column width={10} className='navbar_left'>
                        <Header>
                            <Header.Content onClick={() => this.gotoPreview('/site1')} className='brand'/>
                        </Header>
                    </Grid.Column>
                    <Grid.Column width={6} className='navbar_right'>
                        <div style={{cursor: 'pointer'}} onClick={() => this.gotoPreview('/site1')}>
                            <MaterialIcon icon={'public'}/>
                        </div>
                        <div style={{cursor: 'pointer'}} onClick={() => console.log('')}>
                            <MaterialIcon icon={'notifications_none'}/>
                        </div>

                        <Popup
                            trigger={<div style={{cursor: 'pointer'}} onClick={() => console.log('')}>
                                <MaterialIcon icon={'add'}/>
                            </div>}
                            content={this.menuAddItem()}
                            on='click'
                            position='bottom center'
                            className='gnb_logout'
                        />
                        <Popup
                            trigger={<div style={{cursor: 'pointer'}}>
                                <Image src='/assets/avatar/avatar_default.svg' avatar/>
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

                        <PopProfileViewer data={this.props.userInfo.info} dimmer={false} open={this.state.openProfile}
                                          close={this.closeProfile}></PopProfileViewer>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} className='view_contents'>
                    <Grid.Column width={2} className='view_left'>
                        <Menu secondary vertical className='view_left_menu org_menu'>
                            <Grid.Row>
                                <Segment>
                                    {this.state.OrganizationName}
                                    <div className="markBox" style={{marginLeft: '1em'}}>
                                        {
                                            (this.props.userRole == 'DeveloperManager') ?
                                                <div className="mark markD markM">M</div>
                                                :
                                                (this.props.userRole == 'DeveloperContributor') ?
                                                    <div className="mark markD markC">C</div>
                                                    :
                                                    (this.props.userRole == 'DeveloperViewer') ?
                                                        <div className="mark markD markV">V</div>
                                                        :
                                                        (this.props.userRole == 'OperatorManager') ?
                                                            <div className="mark markO markM">M</div>
                                                            :
                                                            (this.props.userRole == 'OperatorContributor') ?
                                                                <div className="mark markO markC">C</div>
                                                                :
                                                                (this.props.userRole == 'OperatorViewer') ?
                                                                    <div className="mark markO markV">V</div>
                                                                    :
                                                                    <div></div>
                                        }
                                    </div>
                                </Segment>

                            </Grid.Row>
                            {
                                (this.props.userRole) ?
                                    this.OrgMenu.map((item, i) => (
                                        this.menuItemView(item, i, activeItem)
                                    ))
                                    :
                                    this.auth_default.map((item, i) => (
                                        this.menuItemView(item, i, activeItem)
                                    ))
                            }
                        </Menu>
                        <Menu secondary vertical className='view_left_menu'>
                            {
                                (this.props.userRole == 'MEXADMIN' || this.props.userRole == 'superuser') ?
                                    this.menuItems.map((item, i) => (
                                        this.menuItemView(item, i, activeItem)
                                    ))
                                    :
                                    (this.props.userRole == 'DeveloperManager' || this.props.userRole == 'DeveloperContributor' || this.props.userRole == 'DeveloperViewer') ?
                                        this.menuItems.map((item, i) => (
                                            this.menuItemView(item, i, activeItem)
                                        ))
                                        :
                                        (this.props.userRole == 'OperatorManager' || this.props.userRole == 'OperatorContributor' || this.props.userRole == 'OperatorViewer') ?
                                            this.auth_three.map((item, i) => (
                                                this.menuItemView(item, i, activeItem)
                                            ))
                                            :
                                            null
                            }
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={14} style={{height: this.state.bodyHeight}} className='contents_body'>
                        <Grid.Row className='content_title' style={{width: 'fit-content', display: 'inline-block'}}>
                            <Grid.Column className='title_align'>{this.state.headerTitle}</Grid.Column>
                            <Grid.Column className='title_align'>
                                <Item style={{marginLeft: 20, marginRight: 10}}>
                                    <Button color='teal' disabled={this.props.viewBtn.onlyView}
                                            onClick={() => this.onHandleRegistry()}>New</Button>
                                </Item>
                            </Grid.Column>
                        </Grid.Row>
                        {
                            (this.state.headerTitle !== 'Organization' && this.state.headerTitle !== 'Users') ?
                                <Grid.Row style={{padding: '10px 10px 0 10px', display: 'inline-block'}}>
                                    <Dropdown className='selection'
                                              options={this.state.regions}
                                              defaultValue={options[1].value}
                                    />
                                </Grid.Row>
                                : null
                        }
                        {
                            (this.state.headerTitle == 'Users') ?
                                <div style={{top: 15, right: 25, position: 'absolute', zIndex: 99}}>
                                    <Input
                                        action={{color: 'teal', content: 'Search', onClick: (e) => this.searchClick(e)}}
                                        style={{marginRight: '20px'}}/>
                                    <Dropdown defaultValue={this.searchOptions[0].value} search selection
                                              options={this.searchOptions}/>
                                </div>
                                :
                                null
                        }
                        <Grid.Row className='site_content_body' style={{height: '100%'}}>
                            <Grid.Column style={{height: '100%'}}>
                                <ContainerDimensions>
                                    {({width, height}) =>
                                        <div
                                            style={{width: width, height: height, display: 'flex', overflow: 'hidden'}}>
                                            {
                                                (this.state.page === 'pg=0') ? <SiteFourPageOrganization
                                                        userToken={this.state.userToken}></SiteFourPageOrganization> :
                                                    (this.state.page === 'pg=1') ?
                                                        <SiteFourPageUser></SiteFourPageUser> :
                                                        (this.state.page === 'pg=2') ?
                                                            <SiteFourPageCloudlet></SiteFourPageCloudlet> :
                                                            (this.state.page === 'pg=3') ?
                                                                <SiteFourPageFlavor></SiteFourPageFlavor> :
                                                                (this.state.page === 'pg=4') ?
                                                                    <SiteFourPageCluster></SiteFourPageCluster> :
                                                                    (this.state.page === 'pg=5') ?
                                                                        <SiteFourPageClusterInst></SiteFourPageClusterInst> :
                                                                        (this.state.page === 'pg=6') ?
                                                                            <SiteFourPageApps></SiteFourPageApps> :
                                                                            (this.state.page === 'pg=7') ?
                                                                                <SiteFourPageAppInst></SiteFourPageAppInst> :
                                                                                (this.state.page === 'pg=newOrg') ?
                                                                                    <SiteFourPageCreateorga></SiteFourPageCreateorga> :
                                                                                    <div></div>
                                            }
                                        </div>
                                    }
                                </ContainerDimensions>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
                <Motion defaultStyle={defaultMotion} style={this.state.setMotion}>
                    {interpolatingStyle => <div style={interpolatingStyle} id='animationWrapper'></div>}
                </Motion>
            </Grid>
        );
    }

};

const mapStateToProps = (state) => {

    return {
        viewBtn: state.btnMnmt ? state.btnMnmt : null,
        userToken: (state.userToken) ? state.userToken : null,
        userInfo: state.userInfo ? state.userInfo : null,
        userRole: state.showUserRole ? state.showUserRole.role : null,
        selectOrg: state.selectOrg.org ? state.selectOrg.org : null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => {
            dispatch(actions.changeSite(data))
        },
        handleInjectData: (data) => {
            dispatch(actions.injectData(data))
        },
        handleInjectDeveloper: (data) => {
            dispatch(actions.registDeveloper(data))
        },
        handleChangeViewBtn: (data) => {
            dispatch(actions.btnManagement(data))
        },
        handleChangeComputeItem: (data) => {
            dispatch(actions.computeItem(data))
        },
        handleChangeClickCity: (data) => {
            dispatch(actions.clickCityList(data))
        },
        handleUserInfo: (data) => {
            dispatch(actions.userInfo(data))
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(SiteFour)));
