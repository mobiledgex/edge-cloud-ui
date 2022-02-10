import React from 'react'
import * as d3 from 'd3';

class Doughnut extends React.Component {
    constructor(props) {
        super(props)
        this.chart = React.createRef()
    }

    render() {
        return (
            <div ref={this.chart}></div>
        )
    }

    draw = () => {
        const {size} = this.props
        const width = size ? size : 40
        const height = width

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height)/2

        // append the svg object to the div called 'my_dataviz'
        const svg = d3.select(this.chart.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Create dummy data
        const data = { a: 10, b: 50, c: 50 }

        // set the color scale
        const color = d3.scaleOrdinal()
            .range(["#66BC6A", "#AE4140", "#D99E48"])

        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .value(d => d[1])

        const data_ready = pie(Object.entries(data))

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
            .selectAll('whatever')
            .data(data_ready)
            .join('path')
            .attr('d', d3.arc()
                .innerRadius(radius/2)         // This is the size of the donut hole
                .outerRadius(radius)
            )
            .attr('fill', d => color(d.data[0]))
            .style("opacity", 1)
    }

    componentDidMount() {
        this.draw()
    }
}

export default Doughnut