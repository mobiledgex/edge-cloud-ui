import React from 'react';
import Plot from 'react-plotly.js';
import * as aggregation from "../../utils";


var colors = ['#22cccc', '#6699ff','#aa77ff', '#ff8e06' ];
var fontColor = 'rgba(255,255,255,.5)' ;
//https://plot.ly/javascript/line-and-scatter/
var trace1 = {
    x: [1, 2, 3, 4, 5],
    y: [1, 6, 0, 0, 1],
    mode: 'markers+text',
    type: 'scatter',
    name: 'Team A',
    text: ['Find Cloudlet', 'Find Cloudlet', 'Find Cloudlet', 'Find Cloudlet', 'Find Cloudlet'],
    textfont : {
        color:fontColor,
        size:10
    },
    textposition: 'bottom center',
    marker: { size: 8, color:colors[0] },

};

var trace2 = {
    x: [1.5, 2.5, 3.5, 4.5, 5.5],
    y: [4, 0, 0, 1, 4],
    mode: 'markers+text',
    type: 'scatter',
    name: 'Team B',
    text: ['RegisterClient', 'RegisterClient', 'RegisterClient', 'RegisterClient', 'RegisterClient'],
    textfont : {
        color:fontColor,
        size:10
    },
    textposition: 'bottom center',
    marker: { size: 8, color:colors[1] },

};
var trace3 = {
    x: [1.2, 1.5, 4.5, 1.5, 2.5],
    y: [0, 0, 7, 0, 0],
    mode: 'markers+text',
    type: 'scatter',
    name: 'Team C',
    text: ['Location Verify', 'Location Verify', 'Location Verify', 'Location Verify', 'Location Verify'],
    textfont : {
        color:fontColor,
        size:10
    },
    textposition: 'bottom center',
    marker: { size: 10, color:colors[2] },

};

var data = [ trace1, trace2, trace3 ];

var layout = {
    xaxis: {
        range: [ 0.75, 5.25 ]
    },
    yaxis: {
        range: [0, 8]
    },
    title:'Data Labels Hover'
};

let _self = null;
class ScatterMethods extends React.Component {
    constructor() {
        super();
        this.state = {
            scatterData:data
        }
        _self = this;

    }
    UNSAFE_componentWillReceiveProps(nextProps) {

            //this.setState({vWidth:nextProps.size.width, vHeight:nextProps.size.height})
        if(nextProps.data && nextProps.data.methodCall) {
            let dataComp = [];
            let methodCounts = [];
            let mthData = nextProps.data.methodCall;
            let groupData = aggregation.groupBy(mthData, 'dev')
            console.log('result is ....method call counts=', groupData)
            let keys = Object.keys(groupData);
            keys.map((key,i) => {
                let item = {
                    x: [],
                    y: [],
                    mode: 'markers',
                    type: 'scatter',
                    name: key,
                    text: [],
                    textfont : {
                        color:'#cccccc',
                        size:10
                    },
                    textposition: (i%2 === 0)?'bottom center':'top center',
                    marker: { size: 8, color:colors[i] }
                }
                let methodItem = {};
                let groupTime = [];
                groupData[key].map((timeKey) => {
                    //console.log('time data ... 999 888 ', timeData)

                    item.x.push(timeKey.time)
                    item.y.push(timeKey.reqs)
                    item.text.push(timeKey.dev)

                })



                dataComp.push(item)
                console.log('get props dataComp ----', dataComp)

            })
            this.setState({scatterData:dataComp, methodCounts:methodCounts})

        }
    }
    render() {
        const { width, height } = this.props;
        //console.log('size me == ', width, height)
        return (

            <Plot style={{backgroundColor:'transparent', overflow:'hidden', width:width, height:height}}
                data={this.state.scatterData}
                layout={
                    {
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                        xaxis: {
                            showgrid: false,
                            zeroline: true,
                            showline: true,
                            mirror: 'ticks',
                            gridcolor: 'rgba(255,255,255,.05)',
                            gridwidth: 1,
                            zerolinecolor: 'rgba(255,255,255,0)',
                            zerolinewidth: 1,
                            linecolor: 'rgba(255,255,255,.2)',
                            linewidth: 1,
                            color: 'rgba(255,255,255,.4)',
                            domain: [0, 1]
                        },
                        yaxis: {
                            showgrid: true,
                            zeroline: false,
                            showline: true,
                            mirror: 'ticks',
                            ticklen: 3,
                            tickcolor: 'rgba(0,0,0,0)',
                            gridcolor: 'rgba(255,255,255,.05)',
                            gridwidth:1,
                            zerolinecolor: 'rgba(255,255,255,0)',
                            zerolinewidth: 1,
                            linecolor: 'rgba(255,255,255,.2)',
                            linewidth: 1,
                            color: 'rgba(255,255,255,.4)'
                        },

                        title:null,
                        width:this.props.width,
                        height:this.props.height,
                        margin:this.props.margin,
                        showlegend: this.props.showLegend,
                        displayModeBar: false
                    }
                }
            />

        );
    }
}
ScatterMethods.defaultProps = {
    margin: {
        l: 40,
        r: 20,
        b: 20,
        t: 5,
        pad: 0
    },
    marginRight:0,
    showLegend:false,
    width: 360,
    height: 220
}
export default ScatterMethods;
