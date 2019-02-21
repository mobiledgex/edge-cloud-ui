import React, {Component} from 'react';
import axios from 'axios';
import { Grid, Button, Container, Input, Label } from 'semantic-ui-react';
import { spring } from 'react-motion'
import Transition from 'react-motion-ui-pack'
import React3DGlobe from '../libs/react3dglobe';
import { getMockData } from "../libs/react3dglobe/mockData";
import Login from '../components/login';
// API
import * as MyAPI from '../components/utils/MyAPI';
import { LOCAL_STRAGE_KEY } from '../components/utils/Settings';
import { connect } from 'react-redux';
import * as actions from '../actions';
import HeaderGlobalMini from '../container/headerGlobalMini';

import SiteOne from './siteOne';

const pointMarkers = getMockData(0x97bcd8, 'point');

let self = null;
class EntranceGlobe extends Component {

    constructor() {
        super();

        this.state = {
            data: null,
            intro:true,
            clickedMarker: null,
            hoveredMarker: null,
            mouseEvent: null,
            loginState:'out',
            modalOpen: true
        };
        self = this;
    }

    componentDidMount() {
        console.log('user info entranceGlobal ...', this.props.user)
        

        if(this.props.user.login_token) {
            this.setState({modalOpen: false})
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('new props... ', nextProps.user)
        if(nextProps.user.login_token !== undefined) {
            this.setState({modalOpen: false})
        } else {
            this.setState({modalOpen: true})
        }

    }

    //go to NEXT
    goToNext(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=0';
        this.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    logoutRequest = () => {

        const { user } = this.props

        const param = {
            login_token: user.login_token
        }

        MyAPI.logout(param)
            .then((results) => {
                localStorage.removeItem(LOCAL_STRAGE_KEY);
                self.goToNext("/logout")
            })
            .catch((err) => {
                console.log("err: ", err)
                localStorage.removeItem(LOCAL_STRAGE_KEY);
                self.gotoNext("/logout")
            })
        this.setState({modalOpen:true})

    }
    handleMarkerMouseover = (mouseEvent, hoveredMarker) => {
        this.setState({hoveredMarker, mouseEvent});
    };

    handleMarkerMouseout = mouseEvent => {
        this.setState({hoveredMarker: null, mouseEvent});
    };

    handleMarkerClick = (mouseEvent, clickedMarker) => {
        alert('mouse click == '+clickedMarker)
        this.setState({clickedMarker, mouseEvent});
    };

    handleClickLogin() {
        this.setState({modalOpen:false, loginState:'in'})
    }
    render() {
        const {clickedMarker, hoveredMarker, mouseEvent} = this.state;
        return (

            // add data to "data" attribute, and render <Gio> tag

                (this.state.intro)?
                    <div style={{width:'100%', height:'100%', overflow:'hidden'}}>
                        <React3DGlobe
                            markers={pointMarkers}
                            onMarkerMouseover={this.handleMarkerMouseover}
                            onMarkerMouseout={this.handleMarkerMouseout}
                            onMarkerClick={this.handleMarkerClick}
                        />

                        {!this.state.modalOpen &&
                        <HeaderGlobalMini></HeaderGlobalMini>
                        }

                        <Transition
                            component={false} // don't use a wrapping component
                            enter={{
                                opacity: 1,
                                translateY: spring(0, {stiffness: 400, damping: 10})
                            }}
                            leave={{
                                opacity: 0,
                                translateY: 250
                            }}
                        >
                            { this.state.modalOpen &&
                            <div className='intro_login'>
                                <Login></Login>
                            </div>
                            }
                            {!this.state.modalOpen &&
                            <div className='intro_link'>
                                <Button onClick={() => this.goToNext('/site2')}>MobiledgeX Monitoring</Button>
                                <Button onClick={() => this.goToNext('/site4')}>MobiledgeX Compute</Button>
                            </div>
                            }

                        </Transition>

                    </div>
                    :
                    <div style={{width:'100%', height:'100%'}}>
                        <SiteOne />
                    </div>



        )
    }
}
function mapStateToProps ( {user} ) {
    return {
        user
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(EntranceGlobe);
