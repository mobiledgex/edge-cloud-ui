import React from 'react';
import { Sparklines, SparklinesSpots, SparklinesLine, SparklinesNormalBand } from 'react-sparklines';

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
export default class SparkLine extends React.Component {
    constructor() {
        super();
        _self = this;
        this.state = {
            width:200,
            height:50,
            data:[],
            data2:[]
        }
        // setInterval(() =>
        //     this.setState({
        //         data: this.state.data.concat([boxMullerRandom()]),
        //         data2: this.state.data2.concat([boxMullerRandom()])
        //     }), 1000);

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

        this.setState({width:width, height:height})


    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            data: this.state.data.concat([nextProps.value[0]]),
            data2: this.state.data2.concat([nextProps.value[1]])
        })
    }

    formatData(values) {

            console.log('==========  value ===========', values)

    }
    render() {
        let sId = this.props.sId;
        let value = this.formatData(this.props.value);
        return (
            <div style={{display:'flex', flexDirection:'column', border:'1px solid #7d7d7d'}}>
                <Sparklines id='spline_one' data={this.state.data} limit={20} width={this.props.w} height={this.props.h}>
                    <SparklinesNormalBand style={{ fill: "#09141b", fillOpacity: .5, height:30 }} />
                    <SparklinesLine style={{ stroke: "#5675c8", fill: "none"}} />
                    <SparklinesSpots />
                </Sparklines>
                <Sparklines  id='spline_two' style={{position:'absolute', width:200}} data={this.state.data2} limit={20} width={this.props.w} height={this.props.h}>
                    <SparklinesLine id='splineLL' style={{ stroke: "#66b1c8", fill: "none"}} />
                    <SparklinesSpots id='splinespot' />
                </Sparklines>
            </div>
        )
    }
}
SparkLine.defaultProps = {
    sId: String(Math.random()*1000000),
    w:200,
    h:80
}
