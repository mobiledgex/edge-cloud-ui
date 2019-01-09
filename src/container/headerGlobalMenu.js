import React from 'react';
import { Header, Segment, Rating, Button, Image, TransitionablePortal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import ClockComp from '../components/clock';
import moment from 'moment';

const headerStyle = {
    backgroundImage: 'url(/assets/tcs_title.png)',
    backgroundRepeat: 'no-repeat'
}
const transitions = [
    'browse',
    'browse right',
    'drop',
    'fade',
    'fade up',
    'fade down',
    'fade left',
    'fade right',
    'fly up',
    'fly down',
    'fly left',
    'fly right',
    'horizontal flip',
    'vertical flip',
    'scale',
    'slide up',
    'slide down',
    'slide left',
    'slide right',
    'swing up',
    'swing down',
    'swing left',
    'swing right',
    'zoom',
]
let self = null;
class HeaderGlobalMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeBtn1: true,
            activeBtn2: false,
            activeBtn3: false,
            animation: transitions[6], duration: 500, open: false,
            currentTime:''
        }
        self = this;
        this.activeNum = 0;
        this.activeColors = ["#FFA442 !important", "#ff00ff !important"];
        this.onHandleClick = this.onHandleClick.bind(this);
    }

    onHandleClick = (data) => {
        self.setState({
            activeBtn1: (data === 1) ? true : false,
            activeBtn2: (data === 2) ? true : false,
            activeBtn3: (data === 3) ? true : false,
        })

        //브라우져 입력창에 주소 기록
        self.props.history.push({
            pathname: `/site${data}`,
            search: self.props.siteName.subPath,
            state: { some: 'state' }
        });
        self.props.handleChangeSite({mainPath:`/site${data}`, subPath: self.props.siteName.subPath})
    }
    componentDidMount() {
        console.log('will mmm'+this.activeNum)
        let active = this.props.siteName.mainPath;
        this.setState({
            activeBtn1: (active=== '/site1') ? true : false,
            activeBtn2: (active=== '/site2') ? true : false,
            activeBtn3: (active=== '/site3') ? true : false,
        })
    }
    componentWillReceiveProps(nextProps) {
        console.log('site == '+JSON.stringify(nextProps.dsCnt))
        let currentTime = moment(new Date()).format('HH:mm:ss')
        this.setState({currentTime:currentTime, dataStateCnt:nextProps.dsCnt})
    }
    render() {
        let { siteName } = this.props;
        return (

            <div className="menuWrapper">
                <Segment attached>

                  <div className="logoContainer">
                    <Image
                      src='/assets/images/main_logo.png'
                      as='a'
                      style={{width:'160px', height:'33px'}}
                      href='/'
                      target='_self'
                    />
                  </div>
                    <div className="mainTitleBK"
                         style={{backgroundImage:'url(/assets/tcs_title.png)', width:'100%', height:64, position:'absolute',
                             backgroundRepeat: 'no-repeat', top:'-14px !important',
                             backgroundPosition: 'center'}}></div>
                    <div className="mainTitle" style={{position:'absolute', width:'100%'}}>TCS / 하이패스 모니터링 시스템</div>
                    <div style={{position:'absolute', right:0, color:'white', top:15}} >
                        <div style={{position:'absolute', fontSize:12, color:'#1b2144', top:10, left:-100}}>v.1.180621.1</div>
                        <ClockComp/>
                        <TransitionablePortal open={this.state.open} transition={{ animation:this.state.animation, duration:this.state.duration }}>
                            <Segment style={{ right: 100, position: 'fixed', top: 10, zIndex: 1000 }}>
                                <Header style={{fontSize:14}}>로그</Header>
                                <div style={{fontSize:11}}>데이터를 성공적으로 불러왔습니다 <br/> 총 4건</div>

                            </Segment>
                        </TransitionablePortal>
                        <div style={{position:'fixed', top:2, right:10, color:'#497793'}}>{`데이터요청시각 : ${this.state.currentTime} 상태 : ${this.state.dataStateCnt}건`}</div>
                    </div>
                  <Button.Group color='blue' className="mainMenu">
                      <Button onClick={() => this.onHandleClick(1)} active={this.state.activeBtn1} >인천공항</Button>
                      <Button onClick={() => this.onHandleClick(2)} active={this.state.activeBtn2} >북인천</Button>
                      <Button onClick={() => this.onHandleClick(3)} active={this.state.activeBtn3} >청라</Button>
                      {/*<Button onClick={this.onHandleClick}>신공항</Button>*/}
                      {/*<Button onClick={this.onHandleClick}>북인천</Button>*/}
                      {/*<Button onClick={this.onHandleClick}>청라</Button>*/}

                  </Button.Group>

                </Segment>
            </div>
        )
    }
}

//get state in this scope : null
const mapStateToProps = (state) => {
    return {
        siteName: state.siteChanger.site,
        receiveLogs:state.receiveDataReduce,
        dsCnt:state.receiveDataReduce.loaded
    };
};

//set props in this scope....and dispatch event action
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(HeaderGlobalMenu));

///////
