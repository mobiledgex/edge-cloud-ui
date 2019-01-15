import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';

import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import './siteThree.css';
//pages
import SiteFourPageOne from './siteFour_page_one';
import SiteFourPageTwo from './siteFour_page_two';

let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]

let _self = null;
class SiteFour extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight:0,
            contWidth:0,
            bodyHeight:0,
            headerTitle:'',
            activeItem: 'Developers',
            page: 'pg=3'
        };
        this.headerH = 70;
        this.hgap = 0;
        this.menuItems = [
            {label:'Flavors', icon:'free_breakfast'},
            {label:'Clusters', icon:'developer_board'},
            {label:'Operators', icon:'dvr'},
            {label:'Developers', icon:'developer_mode'},
            {label:'Cloudlets', icon:'cloud_queue'},
            {label:'Apps', icon:'apps'},
            {label:'App Instances', icon:'storage'}]
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
        this.setState({ page:'pg='+id, activeItem: label, headerTitle:label })
    }

    onHandleRegistry() {
        this.props.handleInjectDeveloper('userInfo');
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
                            {this.menuItems.map((item, i)=>(
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
                            ))}
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={14} style={{height:this.state.bodyHeight}} className='contents_body'>
                        <Grid.Row columns={2} className='content_title'>
                            <Grid.Column width={8}>{this.state.headerTitle}</Grid.Column>
                            <Grid.Column width={8}><Button color='teal' onClick={() => this.onHandleRegistry()}>New</Button></Grid.Column>
                        </Grid.Row>
                        {(this.state.page === 'pg=3')?<SiteFourPageOne></SiteFourPageOne>:<SiteFourPageTwo></SiteFourPageTwo>}
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


/*

<Menu secondary vertical className='view_left_menu'>
                            <Menu.Item
                                name='Flavors'
                                active={activeItem === 'Flavors'}
                                onClick={(e) => this.handleItemClick(0, e)}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'free_breakfast'}/>
                                    <div className='label'>Flavors</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                name='Clusters'
                                active={activeItem === 'Clusters'}
                                onClick={(e) => this.handleItemClick(1, e)}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'developer_board'} />
                                    <div className='label'>Clusters</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                name='Operators'
                                active={activeItem === 'Operators'}
                                onClick={(e) => this.handleItemClick(2, e)}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'dvr'} />
                                    <div className='label'>Operators</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                name='Developers'
                                active={activeItem === 'Developers'}
                                onClick={(e) => this.handleItemClick(3, e)}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'developer_mode'} />
                                    <div className='label'>Developers</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                name='Cloudlets'
                                active={activeItem === 'Cloudlets'}
                                onClick={(e) => this.handleItemClick(4, e)}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'cloud_queue'} />
                                    <div className='label'>Cloudlets</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                name='Apps'
                                active={activeItem === 'Apps'}
                                onClick={(e) => this.handleItemClick(5, e)}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'apps'} />
                                    <div className='label'>Apps</div>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                name='App Instances'
                                active={activeItem === 'App Instances'}
                                onClick={(e) => this.handleItemClick(6, e)}
                            >
                                <div className="left_menu_item">
                                    <MaterialIcon icon={'storage'} />
                                    <div className='label'>App Instances</div>
                                </div>
                            </Menu.Item>
 */