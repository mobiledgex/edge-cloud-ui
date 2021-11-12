import React from 'react';
import './style.css'
export { default as bullet } from "./bullet";
const d3 = require('d3')

function randomizer(d) {
    var k = d3.max(d.ranges) * .2;
    return function (d) {
        return Math.max(0, d + k * (Math.random() - .5));
    };
}

function randomize(d) {
    if (!d.randomizer) d.randomizer = randomizer(d);
    d.ranges = d.ranges.map(d.randomizer);
    d.markers = d.markers.map(d.randomizer);
    d.measures = d.measures.map(d.randomizer);
    return d;
}



const margin = { top: 7, right: 40, bottom: 12, left: 10 },
    width = 200 - margin.left - margin.right,
    height = 35 - margin.top - margin.bottom;

//rangers - total used
//measures - used, allotted
//markers - total allotted

const bulletChart = (object, data) => {

    var chart = d3.bullet()
        .width(width)
        .height(13);

    var svg = d3.select(object).selectAll("svg")
        .data(data)
        .enter().append("svg")
        .attr("class", "bullet")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(chart);

    var title = svg.append("g")
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + height / 2 + ")");

    title.append("text")
        .attr("class", "title")
        .text(function (d) { return d.title; });

    title.append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")
        .text(function (d) { return d.subtitle; });


}

class BulletChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.myRef = React.createRef();
    }



    render() {
        return (
            <React.Fragment>
                <div ref={this.myRef} id={this.props.id}></div>
            </React.Fragment>
        );
    }

    componentDidUpdate(preProps, preState) {
        if (this.props.data && this.props.data.length > 0) {
            bulletChart(this.myRef.current, this.props.data)
        }
    }



    componentDidMount() {
        bulletChart(this.myRef.current, this.props.data)
    }
}

export default BulletChart