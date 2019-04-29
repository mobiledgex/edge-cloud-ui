import React from 'react'
import { Card, Icon, Image, Grid } from 'semantic-ui-react'
import { DefaultPlayer as Video } from 'react-html5video';
//redux
import { connect } from 'react-redux';
import 'react-html5video/dist/styles.css';
import * as service from "../services/service_cctv";
import * as actions from "../actions";



//https://www.npmjs.com/package/react-html5video
let self = null;

const cardList = [1,2,3,4,5,6,7,8];
const cardStyles = ['twoBytwo', 'threeBytwo', 'threeBythree', 'fourBythree']
const CardExampleCard = (props) => (
    <Card className={(self.props.tabIdx === 1)?self.state.cardStyle:'cardMM'}>
        <Card.Content extra style={{color:'white'}}>
            {props.title[props.id] || 'NO TITLE'}
        </Card.Content>
        {(props.title[props.id]) ?
            <Card.Content style={{textAlign:'center', padding:0}} className={'cardContent'}>
                <object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
                        codebase="http://downloads.videolan.org/pub/videolan/vlc/latest/win32/axvlc.cab"
                        id={props.id} events="true">
                    <param name="AutoLoop" value="False" />
                    <param name="AutoPlay" value="False" />
                    <param name="Volume" value="50" />
                    <param name="toolbar" value="false" />
                    <param name="StartTime" value="0" />
                    <param name="bgcolor" value="#fff" />
                    <embed pluginspage="http://www.videolan.org" type="application/x-vlc-plugin" toolbar="false" version="VideoLAN.VLCPlugin.2" name='vlc'
                           width="0"
                           height="0"
                           bgcolor="#fff"
                           loop="false"
                           text="Waiting for video"
                    >
                    </embed>
                </object>
            </Card.Content>
            : null
        }

        {/*<Video autoPlay loop muted*/}
        {/*controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}*/}
        {/*poster="http://sourceposter.jpg"*/}
        {/*onCanPlayThrough={() => {*/}
        {/*// Do stuff*/}
        {/*}}>*/}
        {/*<source src={videoList[props.id].src} type="video/mp4" />*/}
        {/*<track label="English" kind="subtitles" srcLang="en" src="http://source.vtt" default />*/}
        {/*</Video>*/}
        {/*<embed ref={(ref) => {props.self[props.id] = ref}} width={props.size[0]} height={props.size[1]} id={props.id}*/}
        {/*pluginspage="http://www.videolan.org" type="application/x-vlc-plugin" controls="false" starttime="5" autoplay="true" autostart="false"*/}
        {/*src="http://cctvsec.ktict.co.kr/5017/DJxbrX2tdH7LW3KCJG4dy3A+0YnwxOEM+CXJ/fFJ/Ud7ir+s3xVeVcaaFY9oRGqOsihR1ggpEw4uAhwDoiihsTn6Ol/Tgugj/GvAP69yIaicjAMu8K1oR+Jsr5KKzAoV"*/}
        {/*/>*/}



    </Card>
)

class CardVideo extends React.Component {
    constructor() {
        super();
        this.state = {
            data: null,
            dataTitle:null,
            clientW:256,
            clientH:256*(3/4),
            videoSizeW:320,
            videoSizeH:240,
            columnCount:2,
            columnList:[],
            cardStyle:''
        }
        self = this;
        this.tabIndex = null;
    }
    getVLC(name)
    {
        if (window.document[name])
        {
            return window.document[name];
        }
        if (navigator.appName.indexOf("Microsoft Internet")==-1)
        {
            if (document.embeds && document.embeds[name])
                return document.embeds[name];
        }
        else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
        {
            return document.getElementById(name);
        }
    }
    feedSrcVideo(data) {
        let vlcs = document.getElementsByName('vlc')
        self.props.handleStopVideo('play')

        let videoWidth = (document.getElementsByClassName('cardContent')[0]) ? document.getElementsByClassName('cardContent')[0].clientWidth : self.state.clientW;
        let videoHeight = (document.getElementsByClassName('cardContent')[0]) ? document.getElementsByClassName('cardContent')[0].clientHeight : self.state.clientH;


        if(vlcs) {
            // vlcs.map((vlc, i) => {
            //     vlc.playlist.stop();
            //     vlc.playlist.add(self.state.data[i], "live", ":network-caching=150");
            //     vlc.playlist.play();
            // })

            for(var i=0; i<vlcs.length; i++) {
                var obj = document.getElementById(data.title[i]);
                obj.setAttribute('classid', 'clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921');
                obj.setAttribute('codebase','http://downloads.videolan.org/pub/videolan/vlc/latest/win32/axvlc.cab');
                console.log('for ...length.....'+data.value[i], vlcs.length, vlcs[i])
                if(vlcs[i].playlist){
                    vlcs[i].playlist.stop();
                    vlcs[i].playlist.add(data.value[i]);
                    vlcs[i].playlist.play();
                }
                vlcs[i].setAttribute("controls", "false");
                vlcs[i].setAttribute("toolbar", "false");
                vlcs[i].setAttribute("bgcolor", "#fff");
                vlcs[i].style.width = videoWidth+'px';
                vlcs[i].style.height = videoHeight+'px';
            }

        } else {
            alert('비디오 플레이어가 당신의 브라우져에서 지원되지 않습니다')
        }

    }
    stopVideo() {
        let vlcs = document.getElementsByName('vlc')
        console.log('stop video == '+vlcs)
        if(vlcs && vlcs[0].playlist) {
            for(var i=0; i<vlcs.length; i++) {
                vlcs[i].playlist.stop();
            }
        }
    }
    receiveData(result) {
        let _columnList = [];
        let _columnCount = 0;
        let _cardStyle = 0;
        let leng = result.title.length;
        if(leng <= 4) {
            _cardStyle = cardStyles[0];
            _columnCount = 2;
            _columnList = [0,1,2,3];
        } else if(leng > 4 && leng <= 6){
            _cardStyle = cardStyles[1];
            _columnCount = 3;
            _columnList = [0,1,2,3,4,5];
        } else if(leng > 6 && leng <= 9) {
            _cardStyle = cardStyles[2];
            _columnCount = 3;
            _columnList = [0,1,2,3,4,5,6,7,8];
        } else if(leng > 9 && leng <= 12) {
            _cardStyle = cardStyles[3];
            _columnCount = 4;
            _columnList = [0,1,2,3,4,5,6,7,8,9,10,11];
        }
        this.setState({data:result, columnList:_columnList});
        if(this.props.tabIdx === 1) this.setState({columnCount: _columnCount, cardStyle:_cardStyle});
        this.forceUpdate();
        setTimeout(() => {
            self.feedSrcVideo(result);
        }, 4000)
    }
    receiveDataTitle(result) {
        this.setState({dataTitle:result})
        this.forceUpdate();
    }
    componentWillMount() {


    }
    componentDidMount() {
        //TODO: 컴포넌트의 사이즈를 얻는 방법 ??

        //if(this.props && this.props.data) this.props.data = {};
        console.log('did mount cctv...')

        //TCS
        service.getCctvViewTitle('cctvViewTitle',0, self.receiveDataTitle.bind(self), 60);
        service.getCctvURLTitle('cctvURLTitle',0, self.receiveData.bind(self), 60);
    }
    componentWillReceiveProps(nextProps) {
        console.log('next props = '+JSON.stringify(nextProps))
        if(nextProps.tabIdx && this.tabIndex !== nextProps.tabIdx) {
            this.tabIndex = nextProps.tabIdx;
        }
        if(nextProps.status && nextProps.status === 'stop') {
            this.stopVideo();
        }
    }
    componentWillUnmount() {

    }


    renderCards (title, datas, w, h) {
        let rowSize = 2;
        return (self.props.tabIdx === 0) ?
            datas['title'].map( (list, i) => (
                <Grid.Column><CardExampleCard id={list} title={title} src={datas['value'][i]} self={self} size={{w:w, h:h}}/><br/></Grid.Column>
            ))
            :
            self.state.columnList.map( (list, i) => (
                (i < 6) ? <Grid.Column><CardExampleCard id={datas['title'][i]} title={title} src={datas['value'][i] || ''} self={self} size={{w:w, h:435}}/><br/></Grid.Column>:null
            ))
    }
    /**
     * 페이지 이동전에 cctv요소 스트리밍 및 오브젝트 제거 하기
     **/
    killStreaming() {

    }
    render() {
        return (
            <div ref={(element) => this.myElement = element}>
                <Grid columns={this.state.columnCount}>
                    <Grid.Row ref={ref => this.videoContent = ref}>
                        {(this.state.data && this.state.dataTitle) ? this.renderCards(this.state.dataTitle, this.state.data, this.state.videoSizeW, this.state.videoSizeH) : <div>Loading...</div>}
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
CardVideo.defaultProps = {
    columnCount : 2
}


const mapStateToProps = (state, ownProps) => {
    console.log('tab changer == '+JSON.stringify(state.tabChanger))
    return {
        tabIdx: state.tabChanger.tab,
        status: state.videoControl.status
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleStopVideo: (data) => { dispatch(actions.stopVideo(data))}
    };
};


export default connect(mapStateToProps, mapDispatchProps)(CardVideo);
