import React, { StyleSheet } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import * as d3 from 'd3';
import GradientSVG from './gradientSVG';

//http://www.adeveloperdiary.com/d3-js/how-to-create-progress-chart-using-d3-js/
//https://codepen.io/adeveloperdiary/pen/LpqRQB

class CircularProgressGRD extends React.Component {
    constructor() {
        super();

    }
    componentWillReceiveProps(nextProps) {

    }
    componentDidMount() {
        console.log('d3=')

        setTimeout(()=>this.createChart(), 1000);
    }
    createChart() {
        //////////////////
        var π = Math.PI,
            τ = 2 * π,
            n = 500;
        var createHSL = function(d){
            return d3.hsl(d * 360 / τ, 1, .5)
        }
        var createGradient=function(svg,id,color1,color2, color3){

            var defs = svg.append("svg:defs")

            var red_gradient = defs.append("svg:linearGradient")
                .attr("id", id)
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "30%")
                .attr("y2", "60%")
                .attr("x3", "60%")
                .attr("y3", "100%")
                .attr("spreadMethod", "pad");

            red_gradient.append("svg:stop")
                .attr("offset", "30%")
                .attr("stop-color", color1)
                .attr("stop-opacity", 1);

            red_gradient.append("svg:stop")
                .attr("offset", "60%")
                .attr("stop-color", color2)
                .attr("stop-opacity", 1);

            red_gradient.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", color3)
                .attr("stop-opacity", 1);
        };
        //////////////
        var percent = .9; // 0.0 to 1.0
        var text = (percent * 100) + "%";

        var width = 260;
        var height = 260;
        var thickness = 30;
        var duration = 750;
        var foregroundColor = "#0a8";
        var backgroundColor = "#ccc";

        var radius = Math.min(width, height) / 2;
        var color = d3.scaleOrdinal([foregroundColor, backgroundColor]);

        var svg = d3.select("#chart")
            .append('svg')
            .attr('class', 'pie')
            .attr('width', width)
            .attr('height', height);

        var g = svg.append('g')
            .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
        //////////////////////
        var gcolor = ['#f2503f','#ffd600','#007e00'];
        createGradient(svg,'gradient',gcolor[0],gcolor[1],gcolor[2]);
        /////////////////////

        var arc = d3.arc()
            .innerRadius(radius - thickness)
            .outerRadius(radius);

        var pie = d3.pie()
            .sort(null);

        // var path = g.selectAll('path')
        //     .data(pie([0, 1]))
        //     .enter()
        //     .append('path')
        //     .attr('d', arc)
        //     .attr('fill', function(d, i) {
        //         return color(i);
        //     })
        //     .each(function(d) { this._current = d; });


        var path = g.selectAll('path')
            .data(pie([0, 1]))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i){
                return (i === 0)?'url(#gradient2)':color(i)
            })
            .each(function(d) { this._current = d; });


        path.data(pie([percent, 1-percent])).transition()
            .duration(duration)
            .attrTween('d', function(d) {
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                }
            });

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(text);





    }
    //startColor, endColor, idCSS, rotation

    render() {
        const percentage = 66;
        const grdColors = ['#ff0000', '#ffff00', '#00ff00']
        return (

            <div id="chart"><GradientSVG startColor={grdColors[0]} middleColor={grdColors[1]} endColor={grdColors[2]} idCSS="gradient2" rotation={0}/></div>

        );
    }
}
export default CircularProgressGRD;



/**


var createGradient=function(svg,id,color1,color2){

    var defs = svg.append("svg:defs")

    var red_gradient = defs.append("svg:linearGradient")
        .attr("id", id)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "50%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    red_gradient.append("svg:stop")
        .attr("offset", "50%")
        .attr("stop-color", color1)
        .attr("stop-opacity", 1);

    red_gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", color2)
        .attr("stop-opacity", 1);
};

var percent = 65;

var ratio=percent/100;

var pie=d3.layout.pie()
    .value(function(d){return d})
    .sort(null);

var w=300,h=300;

var outerRadius=(w/2)-10;
var innerRadius=110;

var color = ['#f2503f','#ea0859','#404F70'];

var svg=d3.select("#chart")
    .append("svg")
    .attr({
        width:w,
        height:h,
        class:'shadow'
    }).append('g')
    .attr({
        transform:'translate('+w/2+','+h/2+')'
    });

createGradient(svg,'gradient',color[0],color[1]);

var arc=d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(0)
    .endAngle(2*Math.PI);

var arcLine=d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(0);


var pathBackground=svg.append('path')

    .attr({
        d:arc
    })
    .style({
        fill:color[2]
    });


var pathChart=svg.append('path')
    .datum({endAngle:0})
    .attr({
        d:arcLine
    })
    .style({
        fill:'url(#gradient)'
    });

var middleCount=svg.append('text')
    .text(function(d){
        return d;
    })

    .attr({
        class:'middleText',
        'text-anchor':'middle',
        dy:30,
        dx:-15
    })
    .style({
        fill:color[1],
        'font-size':'90px'

    });
svg.append('text')
    .text('%')
    .attr({
        class:'percent',
        'text-anchor':'middle',
        dx:50,
        dy:-5

    })
    .style({
        fill:color[1],
        'font-size':'40px'

    });

var arcTween=function(transition, newAngle) {
    transition.attrTween("d", function (d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);
        var interpolateCount = d3.interpolate(0, percent);
        return function (t) {
            d.endAngle = interpolate(t);
            middleCount.text(Math.floor(interpolateCount(t)));
            return arcLine(d);
        };
    });
};


var animate=function(){
    pathChart.transition()
        .duration(750)
        .ease('cubic')
        .call(arcTween,((2*Math.PI))*ratio);


};




setTimeout(animate,0);

**/