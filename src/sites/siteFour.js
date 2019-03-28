import React from 'react';
import {Grid, Image, Header, Menu, Dropdown, Button, Popup} from 'semantic-ui-react';
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
import SiteFourPageAppAnaly from './siteFour_page_appanaly';
import SiteFourPageCloudAnaly from './siteFour_page_cloudanaly';



let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]

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
            activeItem: 'Developers',
            page: 'pg=5',
            email: store ? store.email : 'Administrator',
            role:'superuser' //db에서
        };
        this.headerH = 70;
        this.hgap = 0;
        this.menuItems = [
            {label:'Cluster Flavor', icon:'developer_board'},
            {label:'Flavor', icon:'free_breakfast'},
            {label:'Users', icon:'dvr'},
            {label:'Apps', icon:'apps'},
            {label:'App Instances', icon:'storage'},
            {label:'Cluster Instances', icon:'storage'},
            {label:'App Analytics', icon:'insert_chart'},
            {label:'Cloudlets', icon:'cloud_queue'},
            {label:'Cloudlet Analytics', icon:'insert_chart'}
        ]
        this.auth_one = [this.menuItems[0], this.menuItems[1], this.menuItems[2], this.menuItems[3], this.menuItems[4], this.menuItems[5], this.menuItems[6], this.menuItems[7], this.menuItems[8]] //MEXADMIN
        this.auth_two = [this.menuItems[2], this.menuItems[3], this.menuItems[4], this.menuItems[5], this.menuItems[6], this.menuItems[7]] //DeveloperManager, DeveloperContributor, DeveloperViewer
        this.auth_three = [this.menuItems[2], this.menuItems[7], this.menuItems[8]] //OperatorManager, OperatorContributor, OperatorViewer

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
    handleItemClick ( id, label ) {
        console.log('let pg=='+id)
        _self.props.history.push({
            pathname: '/site4',
            search: "pg="+id
        });
        _self.props.history.location.search = "pg="+id;
        this.setState({ page:'pg='+id, activeItem: label, headerTitle:label })
    }

    onHandleRegistry() {
        this.props.handleInjectDeveloper('newRegist');
    }
    componentWillMount() {
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
        this.setState({activeItem:'Developers', headerTitle:'Developers'})
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

    }

    //query data
    getDataDeveloper() {

    }

    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
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
                        <div>
                            <MaterialIcon icon={'notifications_none'} />
                        </div>
                        <Popup
                            trigger={<div style={{cursor:'pointer'}}>
                                <Image src='/assets/avatar/avatar_default.svg' avatar />
                                <span>{this.state.email}</span>
                            </div>}
                            content={<Button content='Log out' onClick={() => this.gotoPreview('/logout')} />}
                            on='click'
                            position='bottom center'
                            className='gnb_logout'
                        />
                        <div>
                            <span>Support</span>
                        </div>


                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} className='view_contents'>
                    <Grid.Column width={2} className='view_left'>
                        <Menu secondary vertical className='view_left_menu'>
                            {
                                (this.state.role === 'superuser')?
                                    this.auth_one.map((item, i)=>(
                                        <Menu.Item
                                            name={item.label}
                                            active={activeItem === item.label}
                                            onClick={() => this.handleItemClick(i, item.label)}
                                        >
                                            <div className="left_menu_item">
                                                <MaterialIcon icon={item.icon}/>
                                                <div className='label'>{item.label}</div>
                                            </div>
                                        </Menu.Item>
                                    ))
                                :
                                    this.auth_two.map((item, i)=>(
                                        <Menu.Item
                                        name={item.label}
                                        active={activeItem === item.label}
                                        onClick={() => this.handleItemClick(i, item.label)}
                                        >
                                        <div className="left_menu_item">
                                        <MaterialIcon icon={item.icon}/>
                                        <div className='label'>{item.label}</div>
                                        </div>
                                        </Menu.Item>
                                        /* 권한 설정 필요 */
                                    ))
                            }
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={14} style={{height:this.state.bodyHeight}} className='contents_body'>
                        <Grid.Row columns={2} className='content_title'>
                            <Grid.Column width={8} className='title_align'>{this.state.headerTitle}</Grid.Column>
                            <Grid.Column width={8} className='title_align'><Button color='teal' onClick={() => this.onHandleRegistry()}>New</Button></Grid.Column>
                        </Grid.Row>
                        <Grid.Row className='site_content_body' style={{height:'100%'}}>
                            <Grid.Column style={{height:'100%'}}>
                                <ContainerDimensions>
                                    { ({ width, height }) =>
                                        <div style={{width:width, height:height, display:'flex', overflow:'hidden'}}>
                                            {
                                                (this.state.page === 'pg=0')?<SiteFourPageCluster></SiteFourPageCluster> :
                                                (this.state.page === 'pg=1')?<SiteFourPageFlavor></SiteFourPageFlavor> :
                                                (this.state.page === 'pg=2')?<SiteFourPageUser></SiteFourPageUser> : // 페이지 설정 안됨
                                                (this.state.page === 'pg=3')?<SiteFourPageApps></SiteFourPageApps>:
                                                (this.state.page === 'pg=4')? <SiteFourPageAppInst></SiteFourPageAppInst> :
                                                (this.state.page === 'pg=5')?<SiteFourPageClusterInst></SiteFourPageClusterInst>:
                                                (this.state.page === 'pg=6')?<SiteFourPageAppAnaly></SiteFourPageAppAnaly> : // 페이지 설정 안됨
                                                (this.state.page === 'pg=7')?<SiteFourPageCloudlet></SiteFourPageCloudlet> :
                                                (this.state.page === 'pg=8')?<SiteFourPageCloudAnaly></SiteFourPageCloudAnaly> : <div> </div> // 페이지 설정 안 됨
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


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))}
    };
};

export default withRouter(connect(null, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFour)));

