import React from 'react'
import * as d3 from 'd3';

class Doughnut extends React.Component {
    constructor(props) {
        super(props)
        this.chart = React.createRef()
    }

    render() {
        const { data, size } = this.props
        return (
            <React.Fragment>
                {data ? <div ref={this.chart} style={{ position: 'relative' }}></div> : <div style={{height:size ?? 40}}></div>}
            </React.Fragment>
        )
    }

    draw = () => {
        const { size, data, colors, label: _label } = this.props

        const width = size ?? 40
        const height = width

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2

        // append the svg object to the div called 'my_dataviz'
        const svg = d3.select(this.chart.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Create dummy data
        const values = data

        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .value(d => d[1])

        const data_ready = pie(Object.entries(values))
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        var path = svg
            .selectAll('g')
            .data(data_ready)
            .join('path')
            .attr('d', d3.arc()
                .innerRadius(radius / 1.5)         // This is the size of the donut hole
                .outerRadius(radius)
            )
            .attr('fill', d => colors[d.data[0]])
            .style("opacity", 1)

        this.label = svg.append("text")
            .attr("class", "total")
            .attr("text-anchor", "middle")
            .attr('font-size', '1.3em')
            .attr('font-weight', '900')
            .attr('fill', 'white')
            .attr('y', 7)
            .attr('x', 0)
            .text(_label)


        // var tooltip = d3.select(this.chart.current)
        //     .append("div")
        //     .style("position", "absolute")
        //     .style("visibility", "hidden")
        //     .style("background-color", "#202125")
        //     .style("border", "solid")
        //     .style("color", "white")
        //     .style("border-radius", "5px")
        //     .style("text-align", "left")
        //     .style("border", "none")
        //     .style("width", "90px")
        //     .style("height", "70px")
        //     .html("<p>I'm a tooltip written in HTML</p>");


        // path.on("mouseover", (e, d) => {
        //     let content = ''
        //     Object.keys(data).forEach(item => (
        //         content = content + `<div style='padding:2px;'><strong>${toFirstUpperCase(item)}: ${data[item]}</strong><div></div>`
        //     ))
        //     tooltip.html(`<div>
        //        ${content}
        //     </div>`)
        //     return tooltip.style("top", (70) + "px")
        //         .style("left", (20) + "px")
        //         .style("visibility", "visible");
        // })
        //   .on("mousemove", (e, d) => { return tooltip.style("top", (e.offsetY - 20) + "px").style("left", (e.offsetX + 50) + "px"); })
        //   .on("mouseout", (e, d) => { return tooltip.style("visibility", "hidden"); });
    }

    updateLabel = (text) => {
        this.label.text(text)
    }

    componentDidUpdate(preProps, preState) {
        const { label } = this.props
        if (preProps.label !== label) {
            this.updateLabel(label)
        }
    }

    componentDidMount() {
        if (this.props.data) {
            this.draw()
        }
    }
}

export default Doughnut