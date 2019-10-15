import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import * as d3 from "d3";


const formatComma = d3.format(",");
const formatFloat = d3.format(".2f");
const formatPercent = d3.format(".1f",".1f");
let divid = 4 / 6; //파이를 1조각에서 6조각으로 더 나눔
let ratio = (360 - 60)/360; // 원에서 하단 좌,우 30도 씩 총60도를 빼준 비율
let availPie = 360 - 60;
let rotateOffset = 180 - 30;
class Gauge extends Component {
    constructor() {
        super();
        this.state = {
            degree: 0,
            boardSrc:'/assets/images/chart_gauge_out_circle.png',
            currentTemp:0,
            label:'NO TITLE',
            unit:'',
            g: null
        }
        this.minTemper = 0;
        this.maxTemper = 200;
        this.roundBoards = ['/assets/images/chart_gauge_out_circle.png', '/assets/gauge_bk_yellow.png', '/assets/gauge_bk_orange.png', '/assets/gauge_bk_red.png']

        this.fakeDatas = [0,    1.41,	1.42,	1.43,	1.44,	1.45,	1.46,	1.47,	1.52,	1.53]
    }

    /*
    온도가 최소 0일 때 각도는 : -90
    온도가 최대 100일 때 각도는 : 90
    100:180 = 현재온도:?
     */
    componentDidMount () {
        let self = this;
        let delay = 3; //seconds
        let count = 0;

        let interval = () => {
            //let currentTemper =  Math.random()*this.maxTemper;// 0 ~ 100
            let fnum = Math.round(Math.random()*9)
            let currentTemper = this.fakeDatas[0] ;// 0 ~ 100
            let currentDegrees = currentTemper * ratio ;// 0 ~ 100
            //let currentTemper =  0;
            //currentTemper = formatPercent(currentTemper);
            //레벨에 따른 배경 색 변경
            // let statusBoard =
            //     (currentTemper < 1.5) ? this.roundBoards[0] :
            //     (currentTemper >= 1.5 && currentTemper < 2.0) ? this.roundBoards[1] :
            //     (currentTemper >= 2.0 && currentTemper < 2.5) ? this.roundBoards[2] :
            //     (currentTemper >= 2.5) ? this.roundBoards[3] : this.roundBoards[0];
            let statusBoard = this.roundBoards[0];
            //self.setState({currentTemp:currentTemper, degree: self.makeDegree(currentDegrees, self), boardSrc: statusBoard, label:this.props.label})
            count ++;
            if(count > self.fakeDatas.length) {
                count = 0;
            }
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
        //console.log('20191009 ----- gauge receive data ==== '+nextProps.data)
        if(nextProps && nextProps.data) {
            this.maxTemper = nextProps.data[1];
            this.renderGauge(nextProps.data[0], {critical1: nextProps.data.critical1, critical2: nextProps.data.critical2,
                major1: nextProps.data.major1, major2: nextProps.data.major2,
                minor1: nextProps.data.minor1, minor2: nextProps.data.minor2
            }, nextProps.type, nextProps.title);
            this.setState({label:nextProps.label, unit:nextProps.unit, type:nextProps.type});
        }
    }


    makeFormat = (value) => {
        return value * ratio ;// 0 ~ 100
    }
    makeDegree = (currentDegrees, self) => {
        let ratioForMax = availPie / self.maxTemper;
        let degree = (currentDegrees*ratioForMax) - rotateOffset;
        console.log('20191009 ----- make degree ==== '+ratioForMax, ":",self.maxTemper,": currentDegress=", currentDegrees,":",rotateOffset, ":degree=", degree)
        return degree;
    }

    renderGauge(value, limits, type, title) {
        let self = this;

        //let currentTemper =  Math.random()*this.maxTemper;// 0 ~ 100
        let currentTemper =  value;
        if(type === 'humi') {
            currentTemper = Number(formatPercent(currentTemper))
        } else if(type === 'Cores') {
            currentTemper = currentTemper
        };
        if(type === 'GB'){
            currentTemper = currentTemper/(1000)
        } else if(type === 'TB') {
            currentTemper = currentTemper/(1000*1000)
        }
        let statusBoard = this.roundBoards[0];

        if(type === 'temp') {
            statusBoard = (currentTemper < limits.minor1 && currentTemper > limits.major1) ? this.roundBoards[1] :
                (currentTemper >= limits.major1 && currentTemper < limits.critical1) ? this.roundBoards[2] :
                    (currentTemper >= limits.critical1) ? this.roundBoards[3] : this.roundBoards[0];
        }
        if(type === 'pue') {
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
        /*
		let totalValue = this.props.sections.length * 5;
        let currentValue = (270 * value) / totalValue;
        let rate = 0.75 / this.props.sections;
        self.setState({currentTemp:currentTemper, degree: (currentValue)- 135, boardSrc: statusBoard})
		*/


        self.setState({currentTemp:formatFloat(currentTemper), degree: self.makeDegree(value, self), boardSrc: statusBoard, label:title})


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
        let {degree} = this.state;
        console.log('20191009 degree in render....... ', degree)
        return (
            <div style={{display:'flex'}}>
                <div style={{position:'relative'}}>
                    <div style={{top:5, position:'absolute'}}><img src={this.state.boardSrc} /></div>
                    {/*<RainbowCircle value={0.5}*/}
                                   {/*size={30}*/}
                                   {/*radius={100}*/}
                                   {/*type={this.props.type}*/}
                                   {/*sections={this.props.sections}*/}
                                   {/*legend={this.props.legend}*/}
                                   {/*label="15%" />*/}
                    <div ref={ref => this.needleImg = ref} style={{position:'absolute', top:0, left:0}}>
                        <Motion
                            key={degree}
                            defaultStyle={{ rotate: 0, scale: 1}}
                            style={{ rotate: spring(degree), scale: spring(1)}}
                        >

                            {style =>
                                (
                                    <div style={{top:0, left:-5, position:'absolute',
                                        transform: `rotate( ${style.rotate}deg )`,
                                    }}><img src='/assets/gauge_needle_red.png' /> </div>
                                )
                            }

                        </Motion>
                    </div>

                    <div style={{position:'absolute', top:10, left:0}}>
                        <img src='/assets/images/chart_gauge_in_circle.png' />
                    </div>
                    <div style={{position:'absolute', top:63, left:10, width:140, backgroundColor:'transparent'}}>
                        <div className={'valueNum'} style={{width:'100%', textAlign:'center', fontSize:20, color:'#bdbdbd'}}>{this.state.label}</div>
                    </div>
                    <div style={{position:'absolute', top:90, left:10, width:140, backgroundColor:'transparent'}}>
                        <div className={'valueNum'} style={{width:'100%', textAlign:'center', fontSize:30, fontWeight:'bold', color:'#fff'}}>{this.state.currentTemp}</div>
                    </div>

                </div>

            </div>
        )
    }
}

export default Gauge;
