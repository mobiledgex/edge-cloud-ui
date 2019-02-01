import React from 'react';
import { Grid, Image, Header, Menu, Dropdown } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import AnalysticViewZone from '../container/analysticViewZone';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import './siteThree.css';
//
import * as service from '../services/service_compute_service';
import * as aggregate from '../utils';

let _devOptionsOne = [
    { key: 'op', value: 'op', text: 'Deutsche Telecom' },
    { key: 'op1', value: 'op1', text: 'SK Telecom' },
    { key: 'op2', value: 'op2', text: 'Other Telecom' }
]
let _devOptionsTwo = [
    { key: 'cl', value: 'cl', text: 'Barcelona MWC' }
]

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
            dropdownValueTwo:'bonn-niantic'
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
    handleChange = (e, { value }) => this.setState({ value })
    componentWillMount() {
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    receiveOper(result) {
        console.log('operators == ', result)
        _self.setState({devOptionsOne: result.map((oper, i) => (
                { key: i, value: oper.OperatorName, text: oper.OperatorName }
            ))})
    }
    receiveCloudlet(result) {
        let groupByOper = aggregate.groupBy(result, 'Operator')
        console.log('receiveCloudlet == ', groupByOper)
        _self.setState({devOptionsTwo: groupByOper['TDG'].map((oper, i) => (
                { key: i, value: oper.CloudletName, text: oper.CloudletName }
            ))})
        _self.setState({cloudletResult:groupByOper})
        //
        //셀렉트박스를 통하여 클러스터 항목 클릭하면.....
        //_self.getClusterInfo('');
    }
    receiveCluster(cloudlet) {

    }
    getClusterInfo() {
        // 오퍼의 클러스터 정보
        //service.getComputeService('cloudlet', this.receiveCloudlet)
    }


    getCloudletList = (operNm) => {
        _self.setState({devOptionsTwo: this.state.cloudletResult[operNm].map((oper, i) => (
                { key: i, value: oper.CloudletName, text: oper.CloudletName }
            ))})
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
        // 오퍼레이터
        service.getComputeService('operator', this.receiveOper)
        // 오퍼의 클러스터 정보
        service.getComputeService('cloudlet', this.receiveCloudlet)
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (
            <Grid className='view_body'>
                <Grid.Row className='gnb_header'>
                    <Grid.Column width={11} className='navbar_left'>
                        <Header>
                            <Header.Content onClick={() => this.gotoPreview('/site2')}>
                                <MaterialIcon icon={'arrow_back'} />
                                MobiledgeX Console
                            </Header.Content>
                        </Header>
                        <div className='nav_filter'>
                            <div className='title'>Operator</div>
                            <div className='filter'>
                                <Dropdown placeholder='Select Operator' fluid search selection options={this.state.devOptionsOne} value={this.state.dropdownValueOne} />
                                <Dropdown placeholder='Barcelona MWC' fluid search selection options={this.state.devOptionsTwo} value={this.state.dropdownValueTwo} onChange={this.handleChange} />
                                <MaterialIcon icon={'refresh'} />
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={5} className='navbar_right'>
                        <div style={{cursor:'pointer'}} onClick={() => this.gotoPreview('/site1')}>
                            <MaterialIcon icon={'public'} />
                        </div>
                        <div>
                            <MaterialIcon icon={'notifications_none'} />
                        </div>
                        <div>
                            <Image src='/assets/avatar/avatar_default.svg' avatar />
                            <span>Administrator</span>
                        </div>
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
                        <AnalysticViewZone></AnalysticViewZone>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

};


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};

export default withRouter(connect(null, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteThree)));
