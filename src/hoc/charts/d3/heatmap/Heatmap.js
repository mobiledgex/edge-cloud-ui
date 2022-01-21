import React from 'react';
import * as d3 from 'd3';

const margin = { top: 10, right: 25, bottom: 20, left: 30 }
const width = 750 - margin.left - margin.right
const height = 250 - margin.top - margin.bottom

class Heatmap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.hmRef = React.createRef()
    }

    render() {
        return (
            <div ref={this.hmRef}></div>
        )
    }


    draw = async () => {
        var svg = d3.select(this.hmRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var data = []
        await d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", async (item) => {
            data.push(item)
        })


        const myGroups = Array.from(new Set(data.map(d => d.group)))
        const myVars = Array.from(new Set(data.map(d => d.variable)))


        var x = d3.scaleBand()
            .range([0, width])
            .domain(myGroups)
            .padding(0.02);

        var y = d3.scaleBand()
            .range([height, 0])
            .domain(myVars)
            .padding(0.02);

       

        // Build color scale
        var myColor = d3.scaleOrdinal(d3.schemePastel1)

        // create a tooltip
        var tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            tooltip
                .html("The exact value of<br>this cell is: " + d.value)
                .style("left", (d3.pointer(this)[0] + 70) + "px")
                .style("top", (d3.pointer(this)[1]) + "px")
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        svg.selectAll()
            .data(data, function (d) { return d.group + ':' + d.variable; })
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.group) })
            .attr("y", function (d) { return y(d.variable) })
            .attr("rx", 1)
            .attr("ry", 1)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) { return myColor(d.value) })
            // .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

    }

    componentDidMount() {
        this.draw()
    }
}

export default Heatmap