import React, { Component } from "react";
import { Grid, Button } from "semantic-ui-react";
// import React3DGlobe from '../libs/react3dglobe';
// import { getMockData } from "../libs/react3dglobe/mockData";
import Login from "../../components/login";
// API
import * as MyAPI from "../../components/utils/MyAPI";
import { LOCAL_STRAGE_KEY } from "../../components/utils/Settings";
import { connect } from "react-redux";
import * as actions from "../../actions";
import HeaderGlobalMini from "../../container/headerGlobalMini";

import SiteOne from "./siteOne";

import { GridLoader } from "react-spinners";
import Alert from "react-s-alert";

// const pointMarkers = getMockData(0x97bcd8, 'point');
let src1 = "assets/images/globe_1.png";
let self = null;
class EntranceGlobe extends Component {
    constructor() {
        super();

        this.state = {
            data: null,
            intro: true,
            clickedMarker: null,
            hoveredMarker: null,
            mouseEvent: null,
            loginState: "out",
            modalOpen: true,
            loading: false,
            signup: false,
            logined: false
        };
        self = this;
        this.spuserToken = null;
    }

    componentDidMount() {
        let store = localStorage.PROJECT_INIT
            ? JSON.parse(localStorage.PROJECT_INIT).userToken
            : null;
        if (store) {
            this.setState({ modalOpen: false, logined: true });
        }
        // && this.props.params.mainPath=='/logout'
        if (this.props.params.mainPath === "/passwordreset") {
            this.setState({ modalOpen: true });
            this.props.handleChangeLoginMode("resetPass");
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        //alert(nextProps.loginMode+":"+this.props.loginMode)
        if (localStorage.getItem(LOCAL_STRAGE_KEY)) {
            this.goToNext("/site4");
        }

        if (nextProps.loginMode && nextProps.loginMode === "verify") {
            this.setState({ modalOpen: true, logined: true });
        } else if (nextProps.loginMode && nextProps.loginMode === "forgot") {
            this.setState({ modalOpen: true, logined: false });
        } else if (nextProps.loginMode === "logout") {
            this.setState({ modalOpen: true, logined: false });
        } else if (nextProps.loginMode === "login") {
            if (nextProps.user.userToken) {
                // It's old code :::::: this.setState({modalOpen: false, logined:true})

                /** goto console page 202004-05-04 @Smith */
                this.goToNext("/site4");
            }
        }

        //Redux Alert
        if (nextProps.alertInfo.mode) {
            Alert.closeAll();
            if (nextProps.alertInfo.mode === "success") {
                Alert.success(nextProps.alertInfo.msg, {
                    position: "top-right",
                    effect: "slide",
                    beep: true,
                    timeout: 10000,
                    offset: 100
                });
            } else if (nextProps.alertInfo.mode === "error") {
                Alert.error(nextProps.alertInfo.msg, {
                    position: "top-right",
                    effect: "slide",
                    beep: true,
                    timeout: 20000,
                    offset: 100
                });
            }
            nextProps.handleAlertInfo("", "");
        }
    }

    //go to NEXT
    goToNext(site) {
        //set organization of localstorage
        if (site == "/site4") {
            localStorage.setItem("selectMenu", "Organizations");
        }
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = "pg=0";
        this.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: "state" }
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({ mainPath: mainPath, subPath: subPath });
    }

    logoutRequest = () => {
        const { user } = this.props;

        const param = {
            login_token: user.userToken
        };

        MyAPI.logout(param)
            .then(results => {
                localStorage.removeItem(LOCAL_STRAGE_KEY);
                self.goToNext("/logout");
            })
            .catch(err => {
                localStorage.removeItem(LOCAL_STRAGE_KEY);
                self.gotoNext("/logout");
            });
        this.setState({ modalOpen: true });
    };

    handleMarkerMouseover = (mouseEvent, hoveredMarker) => {
        this.setState({ hoveredMarker, mouseEvent });
    };

    handleMarkerMouseout = mouseEvent => {
        this.setState({ hoveredMarker: null, mouseEvent });
    };

    handleMarkerClick = (mouseEvent, clickedMarker) => {
        alert("mouse click == " + clickedMarker);
        this.setState({ clickedMarker, mouseEvent });
    };

    handleClickLogin(mode) {
        self.setState({ modalOpen: true });
        setTimeout(() => self.props.handleChangeLoginMode(mode), 500);
    }
    render() {
        const { clickedMarker, hoveredMarker, mouseEvent } = this.state;
        return (
            // add data to "data" attribute, and render <Gio> tag

            this.state.intro ? (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden"
                    }}
                    className="intro_globe"
                >
                    {/*<React3DGlobe*/}
                    {/*markers={pointMarkers}*/}
                    {/*onMarkerMouseover={this.handleMarkerMouseover}*/}
                    {/*onMarkerMouseout={this.handleMarkerMouseout}*/}
                    {/*onMarkerClick={this.handleMarkerClick}*/}
                    {/*/>*/}

                    {this.state.modalOpen && !this.state.logined ? (
                        <Grid
                            style={{
                                backgroundColor: "transparent",
                                height: 100,
                                position: "absolute",
                                top: 20,
                                right: this.state.modalOpen ? 50 : 185,
                                alignSelf: "center"
                            }}
                        >
                            <Grid.Row columns={2}>
                                <Grid.Column className="login_btn">
                                    <Button
                                        onClick={() =>
                                            this.handleClickLogin("login")
                                        }
                                    >
                                        <span>Login</span>
                                    </Button>
                                </Grid.Column>
                                <Grid.Column className="signup_btn">
                                    <Button
                                        onClick={() =>
                                            this.handleClickLogin("signup")
                                        }
                                    >
                                        <span>Create an account</span>
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    ) : (
                        <div></div>
                    )}

                    {this.state.logined && (
                        <div className="intro_gnb_header">
                            <div className="navbar_right">
                                <HeaderGlobalMini
                                    handleClickLogin={this.handleClickLogin}
                                    email={this.state.email}
                                    dimmer={false}
                                ></HeaderGlobalMini>
                            </div>
                        </div>
                    )}

                    {this.state.modalOpen && (
                        <div className="intro_login">
                            <Login></Login>
                        </div>
                    )}
                    {!this.state.modalOpen && (
                        <div className="intro_link">
                            <Button
                                disabled
                                key="0"
                                onClick={() => this.goToNext("/site2")}
                            >
                                MobiledgeX Monitoring
                            </Button>
                            <Button
                                key="1"
                                onClick={() => this.goToNext("/site4")}
                            >
                                MobiledgeX Compute
                            </Button>
                        </div>
                    )}

                    <div className="loadingBox">
                        <GridLoader
                            sizeUnit={"px"}
                            size={20}
                            color={"#70b2bc"}
                            loading={this.state.loading}
                        />
                    </div>
                </div>
            ) : (
                <div style={{ width: "100%", height: "100%" }}>
                    <SiteOne />
                </div>
            )
        );
    }
}
function mapStateToProps(state) {
    return {
        user: state.user,
        userInfo: state.userInfo ? state.userInfo : null,
        loginMode: state.loginMode ? state.loginMode.mode : null,
        alertInfo: {
            mode: state.alertInfo.mode,
            msg: state.alertInfo.msg
        }
    };
}
const mapDispatchProps = dispatch => {
    return {
        handleChangeSite: data => {
            dispatch(actions.changeSite(data));
        },
        handleChangeTab: data => {
            dispatch(actions.changeTab(data));
        },
        handleChangeLoginMode: data => {
            dispatch(actions.changeLoginMode(data));
        },
        handleUserInfo: data => {
            dispatch(actions.userInfo(data));
        },
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg));
        }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(EntranceGlobe);
