import React from 'react';
import * as d3 from 'd3'
import { operators } from '../../../../../helper/constant';

class Histogram extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            toggle:true
        }
    }

    histogramChart = () => {

        var margin = { top: 30, right: 30, bottom: 50, left: 70 },
            width = this.inputField.offsetWidth - 10 - margin.left - margin.right,
            height = this.inputField.offsetHeight - margin.top - margin.bottom,
            title = '';

        var preprocessor = function (d) { return d };
        var chart;

        function graph(selection) {
            selection.each(function (raw, i) {
                // generate chart here; `raw` is the data and `this` is the element
                if (!chart) {
                    chart = d3.select(this)
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    // header
                    // chart.append("text")
                    //     .attr("x", (width/3))
                    //     .attr("y", 0 - (margin.top / 3))
                    //     .attr("text-anchor", "middle")
                    //     .style("font-size", "16px")
                    //     .style('fill', '#CCC')
                    //     .text("Latency Histogram");

                    //x-axis title
                    chart.append("text")
                        .attr("class", "x label")
                        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 15) + ")")
                        //.attr("dy", "1em")
                        .attr("text-anchor", "middle")
                        .text("latency (ms)")
                        .style("font-size", "13px")
                        .style('fill', '#CCC');

                    //y-axis title
                    chart.append("text")
                        .attr("class", "y label")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 0 - margin.left + 5)
                        .attr("x", 0 - (height / 2))
                        .attr("dy", "1em")
                        .attr("text-anchor", "middle")
                        .text("samples")
                        .style("font-size", "13px")
                        .style('fill', '#CCC');
                }

                // preparing data
                var data = {};
                let keys = Object.keys(raw.data).filter(key => (!(key === 'avg' || key === 'max' || key === 'min')))
                for(const key of keys)
                {
                    data[key] = raw.data[key]
                }
                var values = keys.map(key => (data[key]))
                var max = d3.max(values)
                var buckets = raw.buckets;
                buckets.push(max > 100 ? max : 101)
                var bins = d3.histogram().thresholds(buckets)([0, max > 100 ? max : 100]);
                var x = d3.scaleOrdinal()
                    .domain(buckets)
                    .range(buckets.map((_, i) => (i / (buckets.length - 1)) * (width - 60)))

                var x_axis = d3
                    .axisBottom(x)
                    .tickValues(keys)
                    .tickSizeInner(0)
                    .tickSizeOuter(0)
                    .tickPadding(10)

                var y = d3.scaleLinear()
                    .domain([0, d3.max(values)])
                    .range([height, 0])

                var y_axis = d3.axisLeft(y).tickSizeInner(0).tickSizeOuter(0).tickPadding(10)

                chart.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(x_axis)
                    .style('fill', '#CCC');

                chart.append("g")
                    .attr("class", "y axis")
                    .call(y_axis)
                    .style('fill', '#CCC');
                // bars
                var bar = chart.selectAll(".bar").data(bins);

                bar.exit().remove();

                var newBar = bar.enter()
                    .append("g")
                    .attr('class', 'bar')
                    .attr("transform", function (d, i) {
                        return "translate(" + x(d.x0) + "," + y(values[i]) + ")";
                    });

                newBar.append('rect');
                newBar.append('text');

                var all = newBar.merge(bar);

                all.select('rect')
                    .attr("x", 1)
                    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
                    .attr("height", function (d, i) {
                        return height - y(values[i]);
                    })
                    .style("fill", '#2196F3');

                all.select("text")
                    .attr("dy", ".75em")
                    .attr("y", -14)
                    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
                    .attr("text-anchor", "middle")
                    .text(function (d, i) {
                        return values[i];
                    })
                    .style("font-size", "10px")
                    .style('fill', '#FFF');
            });
        }
        return graph;
    }

    render() {
        const { toggle } = this.state
        const { width, height } = this.props
        return (
            toggle ? <React.Fragment>
                <div style={{width:'calc(25vw - 0px)'}} align='center'><h4><b>Latency Histogram</b></h4></div>
                <div style={{ width: `${width ? width : '100%'}`, height: `${height ? height : '50vh'}` }} className='charts' ref={elem => this.inputField = elem}></div>
            </React.Fragment> : null
        )
    }

    renderChart = () => {
        var container = d3.select('.charts');
        const { data, buckets } = this.props
        container.append('svg').datum({ data, buckets }).call(this.histogramChart());
    }

    componentDidUpdate(preProps, preState) {
        //d3 rerender not working, temp solution
        if (!operators.equal(this.props.data, preProps.data)) {
            this.setState({toggle:false}, ()=>{
                this.setState({toggle:true}, ()=>{
                    this.renderChart()
                })
            })
        }

    }

    componentDidMount() {
        this.renderChart()
    }
};

export default Histogram;