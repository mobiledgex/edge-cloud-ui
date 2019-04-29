import React from 'react';
import TimeSeriesFlow from '../charts/plotly/timeseriesFlow';

let _self = null;
function boxMullerRandom () {
    let phase = false,
        x1, x2, w, z;

    return (function() {

        if (phase = !phase) {
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);

            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            return x1 * w;
        } else {
            return x2 * w;
        }
    })();
}

function randomData(n = 30) {
    return Array.apply(0, Array(n)).map(boxMullerRandom);
}

const sampleData = randomData(30);
const sampleData100 = randomData(100);

let customMargin = {
    l: 1,
    r: 1,
    b: 1,
    t: 1,
    pad: 1
}
export default class SparkLine extends React.Component {
    constructor() {
        super();
        _self = this;
        this.state = {
            width:200,
            height:50,
            data:[],
            data2:[],
            network:[],
            networkSeries:[],
            redraw:false, resetData:false, lineLimit:false,
        }
        // setInterval(() =>
        //     this.setState({
        //         data: this.state.data.concat([boxMullerRandom()]),
        //         data2: this.state.data2.concat([boxMullerRandom()])
        //     }), 1000);
        this.dataArray = [];
        this.dataSeries = [];
        this.oldSeries = [];
        this.limitDataLength = 20;
    }
    componentDidMount() {
        var w = _self.props.w;
        var h = _self.props.h;
        console.log('size props == ', _self.props.w, _self.props.h)
        var margin = {
            top: 0.1 * h,
            right: 0.1 * w,
            bottom: 0.1 * h,
            left: 0.1 * w
        };

        var width = w - margin.left - margin.right;
        var height = h - margin.top - margin.bottom;

        this.setState({width:width, height:height, newtwork:[], networkSeries:[]})


    }
    componentWillReceiveProps(nextProps, nextContext) {


        // this.setState({
        //     data: this.state.data.concat([nextProps.value[0]]),
        //     data2: this.state.data2.concat([nextProps.value[1]]),
        //     network: [{In:nextProps.value[0], Out:nextProps.value[1]}],
        //     networkSeries: [nextProps.series]
        // })




        if(nextProps.value) {
            //TODO: 네트웍데이터 가공하기
            let keyLength = Object.keys(nextProps.value).length;
            let newData = true;
            let sCnt = 0;
            let self = this;
            Object.keys(nextProps.value).map((key, i) => {
                if(self.dataArray.length < Object.keys(nextProps.value).length) {
                    self.dataArray.push([])
                    self.dataSeries[0]=[]
                } else {

                    if(nextProps.value[key] && self.oldSeries === nextProps.series){
                        newData = false;
                    } else {
                        newData = true;
                    }

                    //should limit display data in chart
                    /****************
                     * 차트에 표현할 데이터의 개수 정의
                     ****************/
                    if(self.dataArray[i] && self.dataArray[i].length > self.limitDataLength) {
                        //pop first data
                        self.dataArray[i].splice(0,1)
                        if(sCnt === (keyLength - 1)) self.dataSeries[0].splice(0,1)
                    }

                    if(newData && nextProps.value[key]) {
                        self.dataArray[i].push(Number(nextProps.value[key]))
                        if(sCnt === (keyLength - 1)) {
                            self.dataSeries[0].push(nextProps.series)
                            self.oldSeries = nextProps.value[key].time;
                            //console.log('time series == ', self.dataSeries[0] , 'data length='+self.dataArray[i].length, 'limitDataLength='+self.limitDataLength)
                            if(self.dataSeries[0].length === (self.limitDataLength+1)){
                                self.setState({lineLimit: true})
                            }
                            self.setState({redraw:true})
                        } else {

                        }
                        self.setState({[key]:nextProps.value[key]})
                    }

                }
                sCnt ++;
            })

            if(newData){
                self.setState({network:self.dataArray, networkSeries:self.dataSeries, label:nextProps.label})
            }

        }
    }

    formatData(values) {

            //console.log('==========  value ===========', values)

    }
    render() {
        let sId = this.props.sId;
        let value = this.formatData(this.props.value);
        let {network, networkSeries, lineLimit, redraw, label} = this.state;
        return (
            <div className='spark_chart'>
                <TimeSeriesFlow style={{width:'100%', height:'100%'}} chartData={network} series={networkSeries} lineLimit={lineLimit} label={label} redraw={redraw} margin={customMargin} marginRight={40}></TimeSeriesFlow>
            </div>
        )
    }
}
SparkLine.defaultProps = {
    sId: String(Math.random()*1000000),
    w:200,
    h:80,
    backgroundColor:'transparent'
}
