import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStyles } from './sunburst-styling';
import SequenceHorizontal from './SequenceHorizontal'
import { uniqueId } from '../../../../helper/constant/shared';
import { IconButton } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const width = 732;
const radius = width / 6


const color = d3.scaleOrdinal(d3.schemePastel1)

export const fetchColor = (d) => {
    return iconVisible(d.target) && Boolean(d.data.alertType) ? alertTypeIndicator(d.data, 'color') : color(d.data.name)
}

const arcVisible = (d) => {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
}

const labelVisible = (d) => {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
}

const iconVisible = (d) => {
    return d.y1 === 3 && d.y0 === 2 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
}

const labelTransform = (d) => {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
}

const partition = data => {
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    return d3.partition()
        .size([2 * Math.PI, root.height + 1])
        (root);
}

const alertTypes = { error: { label: 'Error', color: '#CC4643', iconCode: '\ue888', icon: 'highlight_off' }, warning: { label: 'Warning', color: '#FFB74D', iconCode: '\uf083', icon: 'warning_amber' } }


const alertTypeIndicator = (d, code) => {
    let type = d.alertType && d.alertType.type
    let alertType = type && alertTypes[type] ? alertTypes[type] : alertTypes['error']
    return alertType[code]
}
const Sunburst = (props) => {
    const { toggle, sequence, dataset, onMore } = props
    const [data, setData] = useState(undefined)
    const [dataFlow, setDataFlow] = useState([])
    const classes = useStyles({ btnVisibility: Boolean(data) })
    const sbRef = useRef(null)

    const sunburstChart = (sequence, dataset) => {
        const format = d3.format(",d")
        const root = partition(dataset);

        //on click
        const clicked = (event, p) => {

            d3.selectAll('polygon')
                .style("fill", function (d) { return d === sequence[p.y0] || d === sequence[p.y1] ? '#388E3C' : '#757575' })
                .attr("stroke", function (d) { return d === sequence[p.y0] || d === sequence[p.y1] ? '#388E3C' : '#757575' });

            parent.datum(p.parent || root);

            logo.style("visibility", p.depth === 0 ? "visible" : "hidden");


            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

            parentLabel.text(p.data.name).style('fill', 'white')
            setData(p.depth > 0 ? p.data : undefined)

            var flow = [];
            var current = p;
            while (current.parent) {
                flow.unshift(current);
                current = current.parent;
            }
            setDataFlow(flow)

            const t = svg.transition().duration(750);

            path.transition(t)
                .tween("data", d => {
                    const i = d3.interpolate(d.current, d.target);
                    return t => d.current = i(t);
                })
                .filter(function (d) {
                    return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                })
                .attr("fill", d => {
                    return fetchColor(d)
                })
                .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.9 : 0.9) : 0)
                .attrTween("d", d => () => arc(d.current));

            label.filter(function (d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
                .attr("fill-opacity", d => +labelVisible(d.target))
                .attrTween("transform", d => () => labelTransform(d.current));
        }

        const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius(d => d.y0 * radius)
            .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

        const svg = d3.select(sbRef.current).append("svg")
            .attr('id', 'chart')
            .attr("viewBox", [0, 0, width, width])
            .style("font", "10px sans-serif")
            .append("g") // append g element
            .attr("transform", `translate(${width / 2},${width / 2})`)

        /**********
         * Tooltip*
         **********/
        var tooltip = d3.select(sbRef.current)
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")

        const path = svg.append("g")
            .selectAll("path")
            .data(root.descendants().slice(1))
            .join("path")
            .attr("fill", d => {
                let data = d.data
                let value = color(data.name)
                if (iconVisible(d) && Boolean(data.alertType)) {
                    value = alertTypeIndicator(data, 'color')
                }
                else if (data.color) {
                    value = data.color;
                }
                return value;
            })
            .attr("fill-opacity", d => arcVisible(d) ? (d.children ? 0.8 : 0.4) : 0)
            .attr("d", d => arc(d));

        path.filter(d => d.children)
            .style("cursor", "pointer")
            .on('click', clicked);

        path.on("mouseover", (e, d) => {
            if (d.children || d.data.alert) {
                tooltip.html(() => {
                    return `<div style="font-size:10px;color:black;" align="left">
                    <p>${'Name: ' + d.data.name}</p>
                    <p>${d.children ? 'Count: ' + format(d.children.length) : ''}</p>
                    <p>${d.data.alert ? `${alertTypes[d.data.alert.type].label}: ` + d.data.alert.msg : ''}</p>
                    </div>`
                });
                tooltip.style("visibility", "visible");
            }
        })
            .on("mousemove", function (e, d) { return tooltip.style("top", (0) + "px").style("left", (0) + "px"); })
            .on("mouseout", function (e, d) { return tooltip.style("visibility", "hidden"); });

        /**********
       * Label*
       **********/

        const labelData = svg.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
            .selectAll("text")
            .data(root.descendants().slice(1))

        const label = labelData
            .join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible(d))
            .attr("transform", d => labelTransform(d))
            .text(d => d.data.name.substring(0, 14) + (d.data.name.length > 14 ? '...' : ''))
            .style('font-size', 14)
            .style('fill', 'white')

        const parent = svg.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", clicked)

        const parentLabel = svg.append("text")
            .attr("class", "total")
            .attr("text-anchor", "middle")
            .attr('font-size', '2em')
            .attr('y', 12)
            .attr('x', 1)

        const logo = svg.append("svg:image")
            .attr('x', -50)
            .attr('y', -21)
            .attr('width', 100)
            .attr("xlink:href", "assets/brand/logo_small_x.png")
    }

    useEffect(() => {
        d3.select('#chart').remove()
        sunburstChart(sequence, dataset)
    }, [toggle]);

    return (
        <React.Fragment>
            <div style={{ marginTop: 10, marginBottom:-25 }} align='center'>
                <SequenceHorizontal key={uniqueId()} dataset={dataFlow} colors={color} />
            </div>
            <div className='sunburst' style={{ padding: '0px 20px 20px 20px', borderRadius: 5 }} ref={sbRef}/>
        </React.Fragment>
    )
}

export default Sunburst