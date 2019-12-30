import React from 'react';
import {Grid, Image, Header, Menu, Dropdown, Button, Popup} from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import AnalysticViewZone from '../container/analysticViewZone';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import './siteThree.css';
//
import * as serviceMC from '../services/serviceMC';
import * as aggregate from '../utils';
import {LOCAL_STRAGE_KEY} from "../components/utils/Settings";

let _devOptionsOne = [
    { key: 'op', value: 'op', text: 'Deutsche Telecom' },
    { key: 'op1', value: 'op1', text: 'SK Telecom' },
    { key: 'op2', value: 'op2', text: 'Other Telecom' }
]
let _devOptionsTwo = [
    { key: 'cl', value: 'cl', text: 'Barcelona MWC' }
]

let rgn = ['US','EU'];
let _self = null;
class SiteThree extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight:0,
            contWidth:0,
            bodyHeight:0,
            activeItem: 'Monitoring',
            devOptionsOne:_devOptionsOne,
            devOptionsTwo:_devOptionsTwo,
            dropdownValueOne:'TDG',
            dropdownValueTwo:'barcelona-mexdemo',
            email:'Administrator',
            selectedCloudlet:null,
            clusters:[],
            clusterInstData:[],
            appClusterData:[]
        };
        this.headerH = 70;
        this.hgap = 0;
    }

    //go to
    gotoPreview(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=1';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    handleChange = (e, { value }) => {
        this.setState({ value })
    }
    handleChangeOne = (e, {value}) => {
        this.setState({ dropdownValueOne: value })
        //reset list of sub dropwDown
        this.setCloudletList(value)
    }
    handleChangeTwo = (e, {value}) => {
        //this.setState({ dropdownValueTwo: value })
    }
    componentWillMount() {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    receiveOper(result) {
        _self.setState({devOptionsOne: result.map((oper, i) => (
                { key: i, value: oper.OperatorName, text: oper.OperatorName }
            ))})
    }
    receiveCloudlet(result) {
        let groupByOper = aggregate.groupBy(result, 'Operator')
        _self.setState({devOptionsTwo: groupByOper['TDG'].map((oper, i) => (
                { key: i, value: oper.CloudletName, text: oper.CloudletName }
            ))})
        _self.setState({cloudletResult:groupByOper})



    }
    receiveAppinst(result) {
        let groupByOper = aggregate.groupBy(result, 'CloudletName')
        console.log('receive cloudlet in appinstance ==<<<<<< ', groupByOper)

        //TODO: 클라우드렛 선택에 대한 클러스터들
    }

    receiveCluster(cloudlet) {

    }
    getClusterInfo() {
        // 오퍼의 클러스터 정보
        //service.getComputeService('cloudlet', this.receiveCloudlet)
    }


    setCloudletList = (operNm) => {
        let cl = [];
        if(_self.state.cloudletResult && _self.state.cloudletResult[operNm]) {
            _self.state.cloudletResult[operNm].map((oper, i) => {
                if(i === 0) _self.setState({dropdownValueTwo: oper.CloudletName})
                cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
            })
        }
        _self.setState({devOptionsTwo: cl})
    }


    receiveResultClusterInst(mcRequest) {
        let result = mcRequest.data;
        if(result.length)_self.groupJoin(result,'clusterInst')
    }


    groupJoin(result,cmpt){
        let clinst = _self.state.clusterInstData;
        if(cmpt == 'clusterInst') this.setState({clusterInstData:_self.state.clusterInstData.concat(result)})
        this.props.handleLoadingSpinner(false);

    }

    getDataDeveloper = (region) => {
        console.log("changeRegion@@",region)
        _self.loadCount = 0;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        //TODO: region에 대한 데이터를  DB에서 가져와야 함.

        let serviceBody = {}
        _self.setState({devData:[], cloudletData:[], clusterInstData:[]})
        if(region !== 'All'){
            rgn = [region];
        } else {
            rgn = ['US','EU'];
        }

        if (localStorage.selectRole == 'AdminManager') {
            rgn.map((item) => {
                // All show clusterInst
                console.log("changeRegionitem", item)
                serviceMC.sendRequest({ token: store ? store.userToken : 'null', method: serviceMC.getEP().SHOW_CLUSTER_INST, data: { region: item } }, _self.receiveResultClusterInst)
            })
        } else {
            rgn.map((item) => {
                serviceBody = {
                    "method": serviceMC.getEP().SHOW_CLUSTER_INST,
                    "token": store ? store.userToken : 'null',
                    "data": {
                        "region": item,
                        "clusterinst": {
                            "key": {
                                "developer": localStorage.selectOrg
                            }
                        }
                    }
                }
                // org별 show clusterInst
                serviceMC.sendRequest(serviceBody, _self.receiveResultClusterInst)
            })
        }

    }
    componentDidMount() {
        console.log('selectedCloudlet check ...', this.props.selectedCloudlet)
        let selectedCloudlet = this.props.selectedCloudlet;
        if(!selectedCloudlet){
            selectedCloudlet = 'barcelona-mexdemo'
        }
        if(selectedCloudlet){
            setTimeout(() => {
                _self.setState({
                    selectedCloudlet:selectedCloudlet,
                    dropdownValueTwo:selectedCloudlet
                })
            }, 1000)

        }
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        // console.log('info.. store == ', store)
        if(store && store.userToken) {
            this.getDataDeveloper('All');
        }


        // Login check
        const storage_data = localStorage.getItem(LOCAL_STRAGE_KEY)
        if (!storage_data) {
            return;
        }
        const storage_json = JSON.parse(storage_data)
        if(storage_json.email) {
            this.setState({email:storage_json.email})
        }


    }
    componentWillReceiveProps(nextProps) {

        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        if(nextProps.user) {
            this.setState({email:nextProps.user.email})
        }


    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (
            <Grid className='view_body'>
                <Grid.Row className='gnb_header'>
                    <Grid.Column width={11} className='navbar_left'>
                        <Header>
                            <Header.Content onClick={() => this.gotoPreview('/site2')} className='brand' >
                                {/* <MaterialIcon icon={'arrow_back'} />
                                MobiledgeX Console */}
                            </Header.Content>
                        </Header>
                        <div className='nav_filter'>
                            <Grid.Row columns={5} className='filter'>
                                <Grid.Column>
                                    <div className='title'>Operator</div>
                                </Grid.Column>
                                <Grid.Column>
                                    <Dropdown placeholder='Select Operator' fluid search selection options={this.state.devOptionsOne} value={this.state.dropdownValueOne} onChange={this.handleChangeOne}/>
                                </Grid.Column>
                                <Grid.Column>
                                    <div className='title'>Cloudlet</div>
                                </Grid.Column>
                                <Grid.Column>
                                    <Dropdown placeholder='Select Cloudlet' fluid search selection options={this.state.devOptionsTwo} value={this.state.dropdownValueTwo} onChange={this.handleChangeTwo} />
                                </Grid.Column>
                                <Grid.Column>
                                    <MaterialIcon icon={'refresh'} />
                                </Grid.Column>
                            </Grid.Row>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={5} className='navbar_right'>
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
                            <Menu.Item
                                name='Monitoring'
                                active={activeItem === 'Monitoring'}
                                onClick={this.handleItemClick}
                                selected
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'desktop_windows'}/>
                                    <div className='label'>Monitoring</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                name='Alarm/Log'
                                active={activeItem === 'Alarm/Log'}
                                onClick={this.handleItemClick}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'access_alarm'} />
                                    <div className='label'>Alarm/Log</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                name='Inventory'
                                active={activeItem === 'Inventory'}
                                onClick={this.handleItemClick}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'list_alt'} />
                                    <div className='label'>Inventory</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                name='Notification'
                                active={activeItem === 'Notification'}
                                onClick={this.handleItemClick}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'notifications_active'} />
                                    <div className='label'>Notification</div>
                                </div>
                            </Menu.Item>
                            {/*<Dropdown item text='Display Options'>*/}
                                {/*<Dropdown.Menu>*/}
                                    {/*<Dropdown.Header>Text Size</Dropdown.Header>*/}
                                    {/*<Dropdown.Item>Small</Dropdown.Item>*/}
                                    {/*<Dropdown.Item>Medium</Dropdown.Item>*/}
                                    {/*<Dropdown.Item>Large</Dropdown.Item>*/}
                                {/*</Dropdown.Menu>*/}
                            {/*</Dropdown>*/}
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={14} style={{height:this.state.bodyHeight}} className='contents_body'>
                        <AnalysticViewZone clusterInstData={this.state.clusterInstData}></AnalysticViewZone>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

};
SiteThree.defaultProps = {
    selectedCloudlet:'barcelona-mexdemo'
}
const mapStateToProps = (state) => {

    return {
        user:state.user
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteThree)));


/*
const CustomerPortalContainer = styled.main
    background-color: rgb(255, 255, 255);
    min-height: 90px;
    width: ${gridSize() * 100}px;
;
const GridLayoutWithWidth = WidthProvider(GridLayout);
<GridLayoutWrapper>
    <GridLayoutWithWidth
        className="layout"
        layout={layout}
        margin={[gridSize() * 2, gridSize()]}
        cols={12}
        rowHeight={13}
        onLayoutChange={bfContext.onLayoutChange}
    >
        {renderLayout(layout)}
    </GridLayoutWithWidth>
</GridLayoutWrapper>
 */
