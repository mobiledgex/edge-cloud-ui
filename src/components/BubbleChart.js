import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {THEME_OPTIONS} from "../shared/Constants";

export default class BubbleChart extends Component {
    constructor(props) {
        super(props);

        this.renderChart = this.renderChart.bind(this);
        this.renderBubbles = this.renderBubbles.bind(this);
        this.renderLegend = this.renderLegend.bind(this);
    }

    componentDidMount() {
        this.svg = ReactDOM.findDOMNode(this);
        this.renderChart();
    }

    componentDidUpdate() {
        const {
            width,
            height,
        } = this.props;
        if (width !== 0 && height !== 0) {
            this.renderChart();
        }
    }

    render() {
        const {
            width,
            height,
        } = this.props;
        return (
            <svg width={width} height={height}/>
        )
    }


    renderChart() {
        const {
            graph,
            data,//label, value
            height,
            width,
            padding,
            showLegend,
            legendPercentage,
        } = this.props;
        // Reset the svg element to a empty state.
        this.svg.innerHTML = '';

        const bubblesWidth = showLegend ? width * (1 - (legendPercentage / 100)) : width;
        const legendWidth = width - bubblesWidth;

        var categorical = [
            {"name": "schemeAccent", "n": 8},
            {"name": "schemeDark2", "n": 8},
            {"name": "schemePastel2", "n": 8},
            {"name": "schemeSet2", "n": 8},
            {"name": "schemeSet1", "n": 9},
            {"name": "schemePastel1", "n": 9},
            {"name": "schemeCategory10", "n": 10},
            {"name": "schemeSet3", "n": 12},
            {"name": "schemePaired", "n": 12},
            {"name": "schemeCategory20", "n": 20},
            {"name": "schemeCategory20b", "n": 20},
            {"name": "schemeCategory20c", "n": 20}
        ]

        let colors = function (s) {
            return s.match(/.{6}/g).map(function (x) {
                return "#" + x;
            });
        };
        let colorCodes = 'DE0000FF9600FFF6005BCB000096FF'
        const color = d3.scaleOrdinal(colors(colorCodes));//green
        const pack = d3.pack()
            .size([bubblesWidth * graph.zoom, bubblesWidth * graph.zoom])
            .padding(padding);

        // Process the data to have a hierarchy structure;
        const root = d3.hierarchy({children: data})
            .sum(function (d) {
                return d.value;
            })
            .sort(function (a, b) {
                return b.value - a.value;
            })
            .each((d) => {
                if (d.data.label) {
                    d.label = '' + d.data.label; //todo:라벨 셋팅 부분..
                    d.type = '' + d.data.type; //todo:type
                    d.id = d.data.label.toLowerCase().replace(/ |\//g, "-");
                    d.favor = d.data.favor;
                    d.fullLabel = d.data.fullLabel;
                    d.cluster_cloudlet = d.data.cluster_cloudlet;
                    d.index = d.data.index;
                    d.color = d.data.color;//@todo ; colorOne
                }
            });

        // Pass the data to the pack layout to calculate the distribution.
        const nodes = pack(root).leaves();

        this.renderBubbles(bubblesWidth, nodes, color);
        // Call to the function that draw the legend.
        if (showLegend) {
            this.renderLegend(legendWidth, height, bubblesWidth, nodes, color);
        }
    }

    renderBubbles(width, nodes, color) {
        const {
            graph,
            data,
            bubbleClickFun,
            valueFont,
            labelFont,
        } = this.props;


        console.log('renderBubbles===>', data);

        const bubbleChart = d3.select(this.svg).append("g")
            .attr("class", "bubble-chart")
            .attr("transform", function (d) {
                //todo: Bubble chart location setting...
                //todo: Bubble chart location setting...
                return "translate(" + ((width * 3 / 16) - 0) + "," + (width * graph.offsetY - 30) + ")"; //버블차트 위치
            });
        ;

        const node = bubbleChart.selectAll(".node").data(nodes).enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("click", function (d) {
                try {
                    bubbleClickFun(d.cluster_cloudlet, d.index);
                } catch (e) {
                }
            })


        node.append("circle")
            .attr("id", function (d) {
                return d.id;
            })
            .attr("r", function (d) {
                return d.r - (d.r * .04);
            })
            .style("fill", function (d) {
                //todo : set colorOne in color_list
                return d.data.color
            })
            .style("z-index", 1)
            .on('mouseover', function (d) {
                d3.select(this).attr("r", d.r * 1.04);
            })
            .on('mouseout', function (d) {
                const r = d.r - (d.r * 0.04);
                d3.select(this).attr("r", r);
            });

        node.append("clipPath")
            .attr("id", function (d) {
                return "clip-" + d.id;
            })
            .append("use")
            .attr("xlink:href", function (d) {
                return "#" + d.id;
            });

        node.append("text")
            .attr("class", "value-text")
            .style("font-size", `${valueFont.size}px`)
            .style("margin-top", `50px`)
            .style("margin-bottom", `50px`)
            .attr("clip-path", function (d) {
                return "url(#clip-" + d.id + ")";
            })
            .style("font-weight", (d) => {
                return valueFont.weight ? valueFont.weight : 300;
            })
            .style("font-family", valueFont.family)
            .style("fill", () => {
                return valueFont.color ? valueFont.color : '#000';
            })
            .style("stroke", () => {
                return valueFont.lineColor ? valueFont.lineColor : '#000';
            })
            .style("stroke-width", () => {
                return valueFont.lineWeight ? valueFont.lineWeight : 0;
            })
            .text((d) => {
                //@todo:number value를 랜더링 하는 부분..(value (%))
                if (d.value > 0) {
                    if (d.type === 'CPU' || d.type === 'DISK' || d.type === 'MEM') {
                        return d.favor + "%";
                    } else {
                        return d.favor;
                    }
                }

            });

        node.append("text")
            .attr("class", "label-text")
            .style("margin-top", `50px`)
            .style("margin-bottom", `50px`)
            .style("font-size", `${labelFont.size}px`)
            .attr("clip-path", function (d) {
                return "url(#clip-" + d.id + ")";
            })
            .style("font-weight", (d) => {
                return labelFont.weight ? labelFont.weight : 300;
            })
            .style("font-family", labelFont.family)
            //.style("font-family", 'Roboto Condensed')
            .style("fill", () => {
                return labelFont.color ? labelFont.color : '#000';
            })
            .style("stroke", () => {
                return labelFont.lineColor ? labelFont.lineColor : '#000';
            })
            .style("stroke-width", () => {
                return labelFont.lineWeight ? labelFont.lineWeight : 0;
            })
            .text(function (d) {
                return d.label
            });

        // Center the texts inside the circles.
        d3.selectAll(".label-text").attr("x", function (d) {
            const self = d3.select(this);
            const width = self.node().getBBox().width;
            return -(width / 2);
        })
            .style("opacity", function (d) {
                const self = d3.select(this);
                const width = self.node().getBBox().width;
                d.hideLabel = width * 1.05 > (d.r * 2);
                return d.hideLabel ? 0 : 0.5;
            })
            .attr("y", function (d) {
                return labelFont.size / 2
            })

        //todo: Center the texts inside the circles.
        d3.selectAll(".value-text").attr("x", function (d) {
            const self = d3.select(this);
            const width = self.node().getBBox().width;
            const height = self.node().getBBox().height;
            return -(width / 2);
        })
            .attr("y", function (d) {
                if (d.hideLabel) {
                    return valueFont.size / 2;
                } else {
                    return -valueFont.size * 1.2;
                }
            });


        //@desc: tooltip
        node.append("title")
            .text(function (d) {
                return d.fullLabel; //@todo: cluster name
            });
    }

    /**
     * @todo: renderLegend
     * @param width
     * @param height
     * @param offset
     * @param nodes
     * @param color
     */
    renderLegend(width, height, offset, nodes, color) {
        const {
            data,
            legendClickFun,
            legendFont,
        } = this.props;
        const bubble = d3.select('.bubble-chart');
        const bubbleHeight = bubble.node().getBBox().height;
        const legend = d3.select(this.svg).append("g")
            .attr("transform", function () {
                // return `translate(${offset},${(bubbleHeight) * 0.18})`;
                return `translate(450,40.000)`;
            })
            .attr("class", "legend")//.style("marginLeft", `-100px`)


        let textOffset = 0;
        const texts = legend.selectAll(".legend-text")
            .data(nodes)
            .enter()
            .append("g")
            .attr("transform", (d, i) => {
                const offset = textOffset;
                textOffset += legendFont.size + 10;
                //todo: first param is x-axis .renderLegend
                //todo: first param is x-axis .renderLegend
                return `translate(-430,${offset})`;
            })
            .on('mouseover', function (d) {
                // d3.select('#' + d.id).attr("r", d.r * 1.04);
            })
            .on('mouseout', function (d) {
                /*  const r = d.r - (d.r * 0.04);
                  d3.select('#' + d.id).attr("r", r);*/
            })
            .on("click", function (d) {
                legendClickFun(d.cluster_cloudlet, d.index);
            });
        ;

        texts.append("rect")
            .attr("width", 30)
            .attr("height", legendFont.size)
            .attr("x", 0)
            .attr("y", -legendFont.size)
            .style("fill", "transparent");

        texts.append("rect")
            .attr("width", legendFont.size)
            .attr("height", legendFont.size)
            .attr("x", 0)
            .attr("y", -legendFont.size)
            .style("fill", (d) => {
                return d.data.color ? d.data.color : color(nodes.indexOf(d));
            });

        texts.append("text")
            .style("font-size", `12px`)
            .style("fill", () => {
                return 'white';
            })
            .style("stroke", () => {
                return legendFont.lineColor ? legendFont.lineColor : '#000';
            })
            .style("stroke-width", () => {
                return legendFont.lineWeight ? legendFont.lineWeight : 0;
            })
            .attr("x", (d) => {
                return legendFont.size + 10
            })
            .attr("y", 0)
            .text((d) => {
                return d.fullLabel
            });
    }
}

BubbleChart.propTypes = {
    graph: PropTypes.shape({
        zoom: PropTypes.number,
        offsetX: PropTypes.number,
        offsetY: PropTypes.number,
    }),
    width: PropTypes.number,
    height: PropTypes.number,
    padding: PropTypes.number,
    showLegend: PropTypes.bool,
    legendPercentage: PropTypes.number,
    legendFont: PropTypes.shape({
        family: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
        weight: PropTypes.string,
    }),
    valueFont: PropTypes.shape({
        family: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
        weight: PropTypes.string,
    }),
    labelFont: PropTypes.shape({
        family: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
        weight: PropTypes.string,
    }),
    themeTitle: PropTypes.string,
}
BubbleChart.defaultProps = {
    graph: {
        zoom: 1.1,
        offsetX: -0.05,
        offsetY: -0.01,
    },
    width: 1000,
    height: 800,
    padding: 0,
    showLegend: true,
    legendPercentage: 20,
    legendFont: {
        family: 'Arial',
        size: 12,
        color: '#000',
        weight: 'bold',
    },
    valueFont: {
        family: 'Arial',
        size: 16,
        color: '#fff',
        weight: 'bold',
    },
    labelFont: {
        family: 'Arial',
        size: 11,
        color: '#fff',
        weight: 'normal',
    },
    bubbleClickFun: (label, index) => {
        console.log(`Bubble ${label} is clicked ...`)
    },
    legendClickFun: (label, index) => {
        console.log(`Legend ${label} is clicked ...`)
    },
    themeTitle: 'EUNDEW'
}
