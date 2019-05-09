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
import * as serviceLogin from "../services/service_login_api";
import {GridLoader} from "react-spinners";
import Alert from 'react-s-alert';

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
            modalOpen: true,
            loading:false,
            signup:false
        };
        self = this;
        this.spuserToken = null;
    }

    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT).userToken : null
        console.log('user info entranceGlobal ...', this.props,store)
        if(store) {
            this.setState({modalOpen: false})
        }
        // && this.props.params.mainPath=='/logout'
        
    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('new props... ', nextProps)
        if(nextProps.user.userToken) {
            this.setState({modalOpen: false})
        }
        // if(nextProps.user.login_token !== undefined) {
        //     this.setState({modalOpen: false})
        //     self.setState({loading:true})
        //     Alert.info('Please wait !', {
        //         position: 'top-right',
        //         effect: 'bouncyflip',
        //         timeout: 'none'
        //     });
        // } else {
        //     self.setState({loading:false})
        //     this.setState({modalOpen: true})
        //
        // }

        //
        // if(nextProps.user.userToken !== undefined) {
        //     this.spuserToken = nextProps.user.userToken;
        //     this.setState({loading:false, modalOpen:false})
        //     Alert.closeAll();
        // }

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
    receiveUser(result, resource, self) {
        console.log('receive user info..', resource, result)

        if(result) {
            // make Export usperpass


        } else {
            //Alert()
        }
        self.setState({loading:false})
    }
    getInfoSuperuser(service) {
        console.log('start get current user info..', self.spuserToken, global.userInfo)

        //static token : test token
        //self.spuserToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTM0Njk3MjIsImlhdCI6MTU1MzM4MzMyMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImtpZCI6M30.Ytg1JWV_iPXCcRfWtWtlVgp3JAKsDro6IqKWqngvf_iF06mLzTkHfCSb4a8E5jd0rWFrrXvfByKZPTjo44-ycQ'

        if(self.spuserToken) {
            self.setState({loading:true})
            serviceLogin.getCurrentUserInfo(service, {superuser:self.spuserToken}, self.receiveUser)
        } else {
            //self.logoutRequest()
            alert('Can not find token, Trying to minute later')
        }
    }
    logoutRequest = () => {

        const { user } = this.props

        const param = {
            login_token: user.userToken
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



                        {(this.state.modalOpen)?
                            <Grid style={{backgroundColor:'transparent', width:230, height:100, position:'absolute', top:20, right:(this.state.modalOpen)?50:185, alignSelf:'center'}}>
                            <Grid.Row columns={2}>
                                <Grid.Column ><Button onClick={() => this.setState({signup:false})}><span>Login</span></Button></Grid.Column>
                                <Grid.Column><Button onClick={() => this.setState({signup:true, modalOpen:true})}><span>SignUp</span></Button></Grid.Column>
                            </Grid.Row>
                        </Grid>
                        :<div></div>}

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
                                <Login signup={this.state.signup}></Login>
                            </div>
                            }
                            {!this.state.modalOpen &&
                            <div className='intro_link'>
                                <Button disabled key='0' onClick={() => this.goToNext('/site2')}>MobiledgeX Monitoring</Button>
                                <Button key='1' onClick={() => this.goToNext('/site4')}>MobiledgeX Compute</Button>
                            </div>
                            }

                        </Transition>
                        <div className="loadingBox">
                            <GridLoader
                                sizeUnit={"px"}
                                size={20}
                                color={'#70b2bc'}
                                loading={this.state.loading}
                            />
                            <Alert stack={{limit: 3}} />
                        </div>
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
