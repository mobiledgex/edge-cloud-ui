import React from 'react';
import * as d3 from 'd3';

let _self = null;
const generateKey = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
}
const _roundedCorners = 2;
const colorsR = ["#ff1133", "#ffee00", "#00cc44"];
const colors = ["#00cc44", "#ffee00", "#ff1133"];
export default class ProgressBarGradient extends React.Component {
    constructor() {
        super();
        _self = this;
        this.state = {
            chartId:generateKey('chartId')
        }
    }
    componentDidMount() {

        let chartId = (this.props.chartId)? this.props.chartId : this.state.chartId;
        this.setState({chartId:chartId})
        console.log('direction--', chartId, this.props.direction)
        let dir = this.props.direction;
        let self = this;

        setTimeout(()=>{

            self.makeChart(chartId, dir, self)
        }, 1000);

    }
    calculateRatio = (chartId, data, max, chartDomWidth) => {
        return (chartDomWidth / max) * data;

    }
    makeChart(chartId, direction, self) {
        var chartDomWidth = document.getElementById(chartId).offsetWidth || 200;
        var w = chartDomWidth, h = 20;
        var roundedCorners = _roundedCorners;
        var chartData;
        let data = self.calculateRatio(chartId, self.props.data, self.props.max, chartDomWidth)
        console.log('chartDomWidth '+chartDomWidth, chartId, self.props.data, self.props.max, chartDomWidth, data)
        if(data) {
            chartData = [{value:data}]
        } else {
            var randomValue = Math.random()*chartDomWidth;
            chartData = [{value:(randomValue < 50)?50:randomValue}]
        }


        var key = d3.select('#'+chartId)
            .data(chartData)
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var bar = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient_"+direction+chartId)
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad")
            .style("border", "1px solid rgba(0, 0, 0, 0.4)")
            .style("border-radius", "10px")

        var mask = key.append("defs")
            .append('clipPath')  // define a clip path
            .attr('id', 'rect-clip_'+direction+chartId)
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", (direction === 'reverse')?w:0)
            .attr("height", h).style("fill", "rgba(0,0,0,0.3)")
            .attr('rx', roundedCorners)
            .attr('ry', roundedCorners)


        bar.append("stop")
            .attr("offset", "15%")
            .attr("stop-color", colors[0])
            .attr("stop-opacity", 1);

        bar.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", colors[1])
            .attr("stop-opacity", 1);

        bar.append("stop")
            .attr("offset", "85%")
            .attr("stop-color", colors[2])
            .attr("stop-opacity", 1);

        //Create clipPath

        var padding = 0;


        key.append("rect")
            .attr("width", w)
            .attr("height", h)
            .attr('rx', roundedCorners)
            .attr('ry', roundedCorners)
            .style("fill", "url(#gradient_"+direction+chartId+")")
            .attr("transform", "translate(0,0)")
            .attr("clip-path", "url(#rect-clip_"+direction+chartId+")")


        if(direction === 'reverse'){
            bar.attr("x1", "100%")
                .attr("x2", "0%");

            //animation
            mask.attr("x", w)
                .transition().duration(1500)
                .attr("x", function(d){ return (w - d.value)})
            ;
        } else {
            //animation
            mask.transition().duration(1500)
                .attr("width", function(d){ return d.value})
            ;
        }



    }
    render() {
       return(
           <div id={this.state.chartId} className="progressContClass"></div>
       )
    }
}