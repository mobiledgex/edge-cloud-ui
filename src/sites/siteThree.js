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


let devOptions = [
    { key: 'af', value: 'af', text: 'Barcelona MWC' },
    { key: 'af', value: 'af', text: 'SK Telecom' },
    { key: 'af2', value: 'af2', text: 'Other Telecom' }
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
            activeItem: 'Monitoring'
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
    componentWillMount() {
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
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
                            <div className='title'>Developer : Deutsche Telecom</div>
                            <div className='filter'>
                                <Dropdown placeholder='Barcelona MWC' fluid search selection options={devOptions} />
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
