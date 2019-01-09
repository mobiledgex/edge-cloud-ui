import React, { Component } from 'react'
import "babel-polyfill";
import ReactPlayer from 'react-player'

const notificationSnd = ['/assets/audio/NOTICE_1.mp3', '/assets/audio/NOTICE_2.mp3', '/assets/audio/NOTICE_3.mp3', '/assets/audio/FMS_NOTICE_2.mp3']
const alarmSnd = ['/assets/audio/charogi_01.mp3']
const speech = ['/assets/audio/charogi_01.mp3','/assets/audio/charozarou_01.mp3'];
const speech_office = ['/assets/audio/charo_incheon.mp3', '/assets/audio/charo_bukinchoen.mp3', '/assets/audio/charo_chungra.mp3'];
const speech_charogi = ['/assets/audio/charo_01.mp3','/assets/audio/charo_02.mp3','/assets/audio/charo_03.mp3','/assets/audio/charo_04.mp3']
const speech_level = ['/assets/audio/charo_minor.mp3','/assets/audio/charo_major.mp3','/assets/audio/charo_critical.mp3','/assets/audio/charo_down.mp3']
//'전원이상','통행원시미수신','영상원시수집이상','VDS이상','영상서버','폐쇄차로통행','','','','','','','','',''
const alarm_dLabel = ['전원이상','통행원시미수신','영상원시수집이상','VDS이상','영상서버','폐쇄차로통행'];
const alarm_detail = ['/assets/audio/charo_detail_01.mp3','/assets/audio/charo_detail_02.mp3','/assets/audio/charo_detail_03.mp3','/assets/audio/charo_detail_04.mp3','/assets/audio/charo_detail_05.mp3','/assets/audio/charo_detail_06.mp3']
class AudioPlayer extends Component {
    constructor() {
        super();
        this.eventList = [];//사운드를 표출해야 할 리스트
        this.composite = [];//사운드 표출 음성 조합[레벨사운드, 이벤트타이틀, .....]
        this.state = {
            nowPlay:'',
            soundToggle: true
        }
        this.started = true;
        this.played = 0;
        this.oldReceiveProps = null;
        this.compareList = null;
    }
    playSoundList(list, index) {
        var lCnt = 0;
        let self = this;
        var loop = function(){
            self.setState({nowPlay : list[index][lCnt]});
            console.log('now play -- '+list[index][lCnt], list[index][lCnt].length);
            lCnt ++ ;
            if(lCnt < list[index].length) {
                setTimeout(()=>{loop()}, 3000)
            }
        }
        loop();

    }
    doPlayingNow(list, compareList) {
        let self = this;

        let played = 0;
        var loop = function() {

            self.playSoundList(list, played);
            played ++;
            if(played < list.length) {
                setTimeout(()=>{loop()}, 6000)
            }
        }

            loop();

    }
    stopSound() {

    }
    compareOldItem(item) {
        let result = true;
        if(this.oldReceiveProps) {
            console.log('old recevie = '+JSON.stringify(this.oldReceiveProps))
            for(var i=0; i<this.oldReceiveProps.value.rows.length; i++) {
                console.log('compare date == '+this.oldReceiveProps.value.rows[i].nLevel)
                var cItem = (this.oldReceiveProps.value.rows[i].nLevel) ? this.oldReceiveProps.value.rows[i].value[1] : "";
                console.log('compare item cItem == ', 'new= '+item, 'old= '+cItem)
                if(cItem === item) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    }
    componentWillReceiveProps(nextProps, prevProps) {
        //음성출력 조건
        // ALARMYN === 'Y' && CONFIRMYN === 'N'
        // 사운드 종류
        // NOTICE_LEVEL '1' or '2'
        let nowAlarm = 0;
        let noticeSnd = '';
        this.eventList = [];
        if(!nextProps.volume) this.stopSound();
        if(nextProps.volume && nextProps.data !== this.oldReceiveProps) {
            //전체 리스트에서 조건이 맞는아이템 추출
            //aid 1 : 차로기기이상 aid 2: 차로자료수집이상
            if(nextProps.data) {
                nextProps.data.value.rows.map((item) => {
                    if(nextProps.aid === 1 && item.value) {
                        if(item.value[0] === 'minor' || item.value[0] === 'minor') {
                            noticeSnd = notificationSnd[0];
                        } else if(item.value[0] === 'major' || item.value[0] === 'critical') {
                            noticeSnd = notificationSnd[1];
                        }
                        let eLevelSnd = (item.value[0] === 'minor')?speech_level[0]:(item.value[0] === 'major')?speech_level[1]:(item.value[0] === 'critical')?speech_level[2]:(item.value[0] === 'down')?speech_level[3]:'';
                        //멀티로 동시에 플레이 --> {""},{""} 차례차례 실행 --> {src:""},{src:""}
                        if(this.compareOldItem(item.value[1]) && item.value[0] !== '') this.eventList.push([noticeSnd,speech[0],eLevelSnd])

                    } else if(nextProps.aid === 2 && item.value && item.value[0] === 'N') {
                        //this.eventList.push(item.value)
                        if(item.nLevel === '1') {
                            noticeSnd = notificationSnd[2];
                        } else if(item.nLevel === '2') {
                            noticeSnd = notificationSnd[3];
                        }
                        //let eLevelSnd = (item.value[0] === 'minor')?speech_level[0]:(item.value[0] === 'major')?speech_level[1]:(item.value[0] === 'critical')?speech_level[2]:(item.value[0] === 'down')?speech_level[3]:'';
                        //멀티로 동시에 플레이 --> {""},{""} 차례차례 실행 --> {src:""},{src:""}
                        let detail =
                            (item.value[4].indexOf(alarm_dLabel[0]) > -1)? alarm_detail[0]:
                            (item.value[4].indexOf(alarm_dLabel[1]) > -1)? alarm_detail[1]:
                            (item.value[4].indexOf(alarm_dLabel[2]) > -1)? alarm_detail[2]:
                            (item.value[4].indexOf(alarm_dLabel[3]) > -1)? alarm_detail[3]:
                            (item.value[4].indexOf(alarm_dLabel[4]) > -1)? alarm_detail[4]:
                            (item.value[4].indexOf(alarm_dLabel[5]) > -1)? alarm_detail[5]:''
                        if(this.compareOldItem(item.value[1])) this.eventList.push([noticeSnd,speech[1],detail])

                    }
                })

                if(this.eventList.length > 0) this.doPlayingNow(this.eventList);

            }


            this.oldReceiveProps = nextProps.data;
        }


        // let say = speech[nextProps.aid];
        // let office = speech_office[0];
        // let charogi = speech_charogi[0];
        // let level = speech_level[0];
        // this.composite = [say,office,charogi]
        // let self = this;
        // if(nextProps.data) {
        //     setTimeout(()=>{
        //         self.setState({nowPlay: self.composite[0]})
        //     }, 1000*nextProps.aid)
        // }

    }
    onEndedHandler() {
        if(this.played < this.composite.length -1){
            this.played ++ ;
            this.setState({nowPlay: this.composite[this.played]})
        } else {
            this.played = 0 ;
        }

    }
    render () {
        let {aid} = this.props || 0;

        return <ReactPlayer style={{display:'none'}} volume={1} progressInterval={500} url={this.state.nowPlay} playing onEnded={() => this.onEndedHandler()}/>
    }
}

export default AudioPlayer;
