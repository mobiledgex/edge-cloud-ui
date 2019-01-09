import React, { Component } from 'react';
import { Header, Divider } from 'semantic-ui-react';
import { Motion, spring } from 'react-motion';
import * as d3 from "d3";
import RainbowCircle from './rainbowCircle';


const formatComma = d3.format(",");
const formatPercent = d3.format(".1f",".1f");
class Gauge extends Component {
    constructor() {
        super();
        this.state = {
            degree: 0,
            boardSrc:'/assets/gauge_bk_blue.png',
            currentTemp:50,
            label:'NO TITLE',
            unit:'',
            g: null
        }
        this.minTemper = 0;
        this.maxTemper = 100;
        this.roundBoards = ['/assets/gauge_bk_blue.png', '/assets/gauge_bk_yellow.png', '/assets/gauge_bk_orange.png', '/assets/gauge_bk_red.png']


    }

    /*
    온도가 최소 0일 때 각도는 : -90
    온도가 최대 100일 때 각도는 : 90
    100:180 = 현재온도:?
     */
    componentDidMount () {
        let self = this;
        let delay = 5; //seconds
        let interval = () => {
            //let currentTemper =  Math.random()*this.maxTemper;// 0 ~ 100
            let currentTemper =  0;
            currentTemper = formatPercent(currentTemper);
            //레벨에 따른 배경 색 변경
            let statusBoard =
                (currentTemper < 50) ? this.roundBoards[0] :
                (currentTemper >= 50 && currentTemper < 70) ? this.roundBoards[1] :
                (currentTemper >= 70 && currentTemper < 80) ? this.roundBoards[2] :
                (currentTemper >= 80) ? this.roundBoards[3] : this.roundBoards[0];
            self.setState({currentTemp:currentTemper, degree: (currentTemper * 180)/100 - 90, boardSrc: statusBoard})

            //setTimeout(interval, 1000 * delay);
        }

        setTimeout(interval, 500)


    }
    componentWillReceiveProps (nextProps) {
        /*
        compareMethod:"gt"
        critical1:28
        curr:-1
        major1:27
        minor1:26
         */
        //console.log('gauge receive data ==== '+nextProps)
        if(nextProps && nextProps.data) {
            this.renderGauge(nextProps.data.curr, {critical1: nextProps.data.critical1, critical2: nextProps.data.critical2,
                major1: nextProps.data.major1, major2: nextProps.data.major2,
                minor1: nextProps.data.minor1, minor2: nextProps.data.minor2
            }, nextProps.type);
            this.setState({label:nextProps.label, unit:nextProps.unit, type:nextProps.type});


        }
    }


    renderGauge(value, limits, type) {
        let self = this;

        //let currentTemper =  Math.random()*this.maxTemper;// 0 ~ 100
        let currentTemper =  value;
        currentTemper = Number(formatPercent(currentTemper));
        let statusBoard = this.roundBoards[0];

        if(type === 'temp') {
            statusBoard = (currentTemper < limits.minor1 && currentTemper > limits.major1) ? this.roundBoards[1] :
                (currentTemper >= limits.major1 && currentTemper < limits.critical1) ? this.roundBoards[2] :
                    (currentTemper >= limits.critical1) ? this.roundBoards[3] : this.roundBoards[0];
        }

        if(type === 'humi') {
            if(currentTemper > limits.minor1 && currentTemper < limits.minor2) { //정상
                statusBoard = this.roundBoards[0]
            } else { //임계치 초과
                //minor(min)
                if(currentTemper <= limits.minor1 && currentTemper > limits.major1) statusBoard = this.roundBoards[1];
                //minor(max)
                if(currentTemper >= limits.minor2 && currentTemper < limits.major2) statusBoard = this.roundBoards[1];
                //major(min)
                if(currentTemper <= limits.major1 && currentTemper > limits.critical1) statusBoard = this.roundBoards[2];
                //major(max)
                if(currentTemper >= limits.major2 && currentTemper < limits.critical2) statusBoard = this.roundBoards[2];
                //critical(min/max)
                if(currentTemper <= limits.critical1 || currentTemper >= limits.critical2) statusBoard = this.roundBoards[3];

            }
        }

        //degree : 바늘의 각도
        //총270도에서 sections개수(12, 20)개로 나누고 눈금단위를 5로 설정 (60, 100)
        let totalValue = this.props.sections.length * 5;
        let currentValue = (270 * value) / totalValue;
        let rate = 0.75 / this.props.sections;
        self.setState({currentTemp:currentTemper, degree: (currentValue)- 135, boardSrc: statusBoard})

    }
    _percToDeg(perc) {
        return perc * 360;
    }

    _percToRad(perc) {
        return this._degToRad(this._percToDeg(perc));
    }

    _degToRad(deg) {
        return deg * Math.PI / 180.5;
    }

    _deg2rad(deg) {
        return deg / 180 * Math.PI;
    }

    render() {

        return (
            <div style={{display:'flex'}}>
                <div style={{position:'relative'}}>
                    <Motion defaultStyle={{x: 0}} style={{x: spring(10)}}>
                        {interpolatingStyle => <img src={this.state.boardSrc} style={interpolatingStyle} />}
                    </Motion>
                    <RainbowCircle value={15}
                                   size={20}
                                   radius={100}
                                   type={this.props.type}
                                   sections={this.props.sections}
                                   legend={this.props.legend}
                                   label="15%" />
                    <div ref={ref => this.needleImg = ref} style={{position:'absolute', top:0, left:0}}>
                        <Motion
                            defaultStyle={{ rotate: 0, scale: 1}}
                            style={{ rotate: spring(this.state.degree), scale: spring(1)}}
                        >

                            {style =>
                                (
                                    <div style={{
                                        transform: `rotate( ${style.rotate}deg )`,
                                    }}><img src='/assets/gauge_needle_red.png' /> </div>
                                )
                            }

                        </Motion>
                    </div>

                    <div style={{position:'absolute', top:36, left:35}}>
                        <img src='/assets/gauge_cover_value.png' />
                    </div>
                    <div style={{position:'absolute', top:70, left:40}}>
                        <Header style={{width:105, textAlign:'center', fontSize:20}}>{this.state.currentTemp}{this.state.unit}</Header>
                    </div>
                    <div style={{position:'absolute', top:85, left:40, width:90}}>
                        <Divider />
                    </div>
                    <div style={{position:'absolute', top:95, left:40}}>
                        <Header style={{width:105, textAlign:'center', fontSize:16}}>{this.state.label}</Header>
                    </div>

                </div>

            </div>
        )
    }
}

export default Gauge;