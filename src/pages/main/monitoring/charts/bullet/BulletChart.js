import React from 'react';
import './style.css'
export { default as bullet } from "./bullet";
const d3 = require('d3')

//rangers - total used
//measures - used, allotted
//markers - total allotted
var data = [
    { "title": "Revenue", "subtitle": "US$, in thousands", "ranges": [150, 225, 300], "measures": [220, 270], "markers": [250] },
    { "title": "Profit", "subtitle": "%", "ranges": [20, 25, 30], "measures": [21, 23], "markers": [26] },
    { "title": "Order Size", "subtitle": "US$, average", "ranges": [350, 500, 600], "measures": [100, 320], "markers": [550] },
    { "title": "New Customers", "subtitle": "count", "ranges": [1400, 2000, 2500], "measures": [1000, 1650], "markers": [2100] },
    { "title": "Satisfaction", "subtitle": "out of 5", "ranges": [3.5, 4.25, 5], "measures": [3.2, 4.7], "markers": [4.4] }
];

class BulletChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <section id={'section'} ></section>
        );
    }



    bulletChart = () => {

        var margin = { top: 0, right: 40, bottom: 12, left: 10 },
        width = 200 - margin.left - margin.right,
        height = 35 - margin.top - margin.bottom;

        function graph(selection) {
            selection.each(function (data2) {
                console.log(data2)


                var chart = d3.bullet()
                    .width(width)
                    .height(16);

                var svg = d3.select("section").selectAll("svg")
                    .data(data2.data)
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
            });
        }
        return graph;
    }

    componentDidMount() {
        var container = d3.select(`section`);
        container.append('svg').datum({ id: this.props.id, data: this.props.data }).call(this.bulletChart());
    }
}

export default BulletChart