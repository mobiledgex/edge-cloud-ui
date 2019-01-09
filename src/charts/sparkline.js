import React from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import _ from 'lodash';

//ref : https://codepen.io/keelerrussell/pen/NwVjwX?page=1
let _self = null;
export default class SparkLine extends React.Component {
    constructor() {
        super();
        _self = this;
    }
    componentDidMount() {

        function quantile(dps, p) {
            dps.sort(function(a, b) {
                return a - b;
            });
            return dps[Math.floor(p * (dps.length - 1))];
        }

        function sparkline(svgName, trend) {
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

            var times = _.map(trend, "time");
            var values = _.map(trend, "value");
            var q25 = quantile(values, 0.25);
            var median = quantile(values, 0.5);
            var q75 = quantile(values, 0.75);

            var scaleX = d3
                .scaleTime()
                .domain(d3.extent(times))
                .range([0, width]);
            var scaleY = d3
                .scaleLinear()
                .domain(d3.extent(values))
                .range([height, 0]);

            var line = d3
                .line()
                .x(function(d, i) {
                    return scaleX(d.time);
                })
                .y(function(d, i) {
                    return scaleY(d.value);
                });

            // Make an SVG to start drawing on
            var svg = d3
                .select(svgName)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "chart-base");

            var g = svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Put a box showing interquartile range
            g
                .append("rect")
                .attr("class", "interquartile-box")
                .attr("x", 0)
                .attr("width", width)
                .attr("y", scaleY(q75))
                .attr("height", Math.abs(scaleY(q75) - scaleY(q25)));

            // Put a dashed line at the median
            g
                .append("line")
                .attr("class", "reference-line")
                .attr("x1", 0)
                .attr("y1", scaleY(median))
                .attr("x2", width)
                .attr("y2", scaleY(median));

            // Plot the sparkline itself
            g
                .append("path")
                .datum(trend)
                .attr("class", "sparkline")
                .attr("d", line);

            // Indicate the first point with a special point
            var firstPoint = g.append("g");
            var firstPointIndex = 0;
            var firstPointX = scaleX(trend[firstPointIndex].time);
            var firstPointY = scaleY(trend[firstPointIndex].value);
            firstPoint
                .append("circle")
                .attr("class", "sparkline-end-point")
                .attr("r", 2)
                .attr("cx", firstPointX)
                .attr("cy", firstPointY);

            var firstText = svg.append("text").attr("class", "sparkline-end-point");
            firstText.text(formatValue(trend[firstPointIndex].value));
            var firstTextBBox = firstText.node().getBBox();
            firstText
                .attr("x", margin.left - firstTextBBox.width - 2)
                .attr(
                    "y",
                    margin.top +
                    scaleY(trend[firstPointIndex].value) +
                    firstTextBBox.height / 2
                )
                .attr("dx", ".2em")
                .attr("dy", ".2em");

            // Indicate the last point with a special point
            var lastPoint = g.append("g");
            var lastPointIndex = trend.length - 1;
            var lastPointX = scaleX(trend[lastPointIndex].time);
            var lastPointY = scaleY(trend[lastPointIndex].value);
            lastPoint
                .append("circle")
                .attr("class", "sparkline-end-point")
                .attr("r", 2)
                .attr("cx", lastPointX)
                .attr("cy", lastPointY);

            var lastText = svg.append("text").attr("class", "sparkline-end-point");
            lastText.text(formatValue(trend[lastPointIndex].value));
            var lastTextBBox = lastText.node().getBBox();
            lastText
                .attr("x", margin.left + width + 2)
                .attr(
                    "y",
                    margin.top + scaleY(trend[lastPointIndex].value) + lastTextBBox.height / 2
                )
                .attr("dx", ".2em")
                .attr("dy", ".2em");

            // Indicate the max with a special point
            var maxPoint = g.append("g");
            var maxPointIndex = _.findIndex(trend, function(x) {
                return x.value === d3.max(values);
            });
            var maxPointX = scaleX(trend[maxPointIndex].time);
            var maxPointY = scaleY(trend[maxPointIndex].value);
            maxPoint
                .append("circle")
                .attr("class", "sparkline-max-point")
                .attr("r", 2)
                .attr("cx", maxPointX)
                .attr("cy", maxPointY);

            maxPoint
                .append("text")
                .attr("class", "sparkline-max-point")
                .attr("x", maxPointX)
                .attr("y", maxPointY - 3)
                .attr("dx", ".2em")
                .attr("dy", ".2em")
                .text(formatValue(trend[maxPointIndex].value));

            // Indicate the min with a special point
            var minPoint = g.append("g");
            var minPointIndex = _.findIndex(trend, function(x) {
                return x.value === d3.min(values);
            });
            var minPointX = scaleX(trend[minPointIndex].time);
            var minPointY = scaleY(trend[minPointIndex].value);
            minPoint
                .append("circle")
                .attr("class", "sparkline-min-point")
                .attr("r", 2)
                .attr("cx", minPointX)
                .attr("cy", minPointY);

            minPoint
                .append("text")
                .attr("class", "sparkline-min-point")
                .attr("x", minPointX)
                .attr("y", minPointY + 5)
                .attr("dx", ".2em")
                .attr("dy", ".2em")
                .text(formatValue(trend[minPointIndex].value));

            // Handle hovering over points
            var focus = g
                .append("g")
                .attr("class", "focus")
                .style("display", "none");

            // Put text at the focus point, with a box behind it
            focus
                .append("rect")
                .attr("width", 38)
                .attr("height", 20)
                .attr("x", 4)
                .attr("y", -11)
                .attr("class", "focusrect");

            focus
                .append("text")
                .attr("class", "focustext")
                .attr("x", 5)
                .attr("dy", ".2em");

            // Put a circle at the point
            focus.append("circle").attr("r", 2);

            // Set up mouse detection
            svg
                .append("rect")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "sparkline-overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() {
                    focus.style("display", null);
                })
                .on("mouseout", function() {
                    focus.style("display", "none");
                })
                .on("mousemove", mousemove);

            function mousemove() {
                var x0 = scaleX.invert(d3.mouse(this)[0]),
                    i = bisectDate(trend, x0, 1),
                    d0 = trend[i - 1],
                    d1 = trend[i],
                    d = x0 - d0 > d1 - x0 ? d1 : d0;
                focus.attr(
                    "transform",
                    "translate(" + scaleX(d.time) + "," + scaleY(d.value) + ")"
                );
                var t = focus.select("text");
                // Update text to value under mouse
                t.text(function() {
                    return (
                        formatValue(d.value) +
                        " [" +
                        moment(d.time).format("YYYY-MM-DD HH:mm") +
                        "]"
                    );
                });
                // Update the box behind the text to fit the text
                var bbox = t.node().getBBox();
                var r = focus.select("rect");
                var pad = 3;
                r.attr("x", bbox.x);
                r.attr("y", bbox.y - pad);
                r.attr("width", bbox.width + pad);
                r.attr("height", +bbox.height + pad);
            }
        }

        function createTrend(numDays) {
            var trend = [];
            var currTime = moment().startOf("month");
            var shift = Math.random() * Math.PI;
            var spread = numDays * 1.5 * Math.PI;
            for (var i = 0; i < numDays * 24; i++) {
                var noise = trend.push({
                    time: currTime.add({ hours: 1 }).toDate(),
                    value:
                    100 *
                    (Math.sin(3 * i / spread + shift) +
                    2.5 +
                    2.5 * (Math.random() < 0.9 ? Math.random() - 0.5 : 0))
                });
            }
            return trend;
        }

        var bisectDate = d3.bisector(function(d) {
            return d.time;
        }).left;

        function formatValue(v) {
            return +v.toFixed(2);
        }
        let self = this;
        sparkline('#'+this.props.sId, createTrend(7 * Math.random() + 3));
        setTimeout(() => createTrend(7 * Math.random() + 3), 3000)

    }
    render() {
        let sId = this.props.sId;
        return (
            <div id={sId}/>

        )
    }
}
SparkLine.defaultProps = {
    sId: String(Math.random()*1000000),
    w:200,
    h:80
}