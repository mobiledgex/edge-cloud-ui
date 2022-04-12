/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import * as d3 from 'd3'

export const histogramChart_X = () => {
    var padding = 9;
    var width = 350;
    var innerWidth = width - (padding * 2);
    var barHeight = 12;
    var height = 38;
    function graph(selection) {
        selection.each(function (data1, i) {
            var colors = data1.colors
            var buckets = data1.buckets
            var data = colors.map((item, i) => {
                return { color: item[1], value: buckets[i], offset: item[0] }
            })

            var svg = d3.select(this)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            var g = svg.append("g").attr("transform", "translate(" + padding + ", 0)");

            var defs = svg.append("defs");
            var linearGradient = defs.append("linearGradient").attr("id", "myGradient");
            linearGradient.selectAll("stop")
                .data(data)
                .enter().append("stop")
                .attr("offset", d => (`${d.offset}%`))
                .attr("stop-color", d => d.color);

            g.append("rect")
                .attr("width", innerWidth)
                .attr("height", barHeight)
                .style("fill", "url(#myGradient)");

            var xTicks = [0, 5, 10, 25, 50, 100];

            var xScale = d3.scaleLinear()
                .range([0, innerWidth])
                .domain(d3.extent(data, d => d.value));

            var xAxis = d3.axisBottom(xScale)
                .tickSize(barHeight * 2)
                .tickValues(xTicks);

            g.append("g")
                .call(xAxis)
                .select(".domain").remove();
        });
    }
    return graph;
}

export const histogramChart_Y = () => {
    var padding = 9
    var width = 60
    var height = 300
    var innerWidth = height - (padding * 3);
    var barWidth = 28;
    function graph(selection) {
        selection.each(function (data1, i) {

            var colors = data1.colors
            var buckets = data1.buckets
            var data = colors.map((item, i) => {
                return { color: item[1], value: buckets[i], offset: item[0] }
            })

            var svg = d3.select(".charts")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(-290," + 0 + ")");

            var defs = svg.append("defs");
            var linearGradient = defs.append("linearGradient").attr("id", "myGradient").attr("gradientTransform", "rotate(90)");
            linearGradient.selectAll("stop")
                .data(data)
                .enter().append("stop")
                .attr("offset", d => (`${d.offset}%`))
                .attr("stop-color", d => d.color);

            svg.append("rect")
                .attr("width", barWidth)
                .attr("height", innerWidth)
                .attr("transform", "translate(0," + padding + ")")
                .style("fill", "url(#myGradient)");

            var xTicks = [0, 5, 10, 25, 50, 100];

            var xScale = d3.scaleLinear()
                .range([0, innerWidth])
                .domain(d3.extent(data, d => d.value));

            var xAxis = d3.axisRight(xScale)
                .tickSize(barWidth + 10)
                .tickValues(xTicks);

            svg.append("g")
                .call(xAxis)
                .attr("transform", "translate(0," + padding + ")")
                .select(".domain").remove();
        });
    }
    return graph;
}

class Legend extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='charts'></div>
        )
    }

    renderChart = () => {
        var container = d3.select('.charts');
        const { colors, buckets, horizontal } = this.props
        container.append('svg').datum({ colors, buckets }).call(horizontal ? histogramChart_X() : histogramChart_Y());
    }

    componentDidMount() {
        this.renderChart()
    }
};

export default Legend;