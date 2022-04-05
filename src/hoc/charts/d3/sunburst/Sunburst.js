import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import SequenceHorizontal from './SequenceHorizontal'
import { uniqueId } from '../../../../helper/constant/shared';

const width = 732;
const radius = width / 6.5


const color = d3.scaleOrdinal(d3.schemePastel1)

export const fetchColor = (d) => {
    return iconVisible(d.target) && Boolean(d.data.alertType) ? alertTypeIndicator(d.data, 'color') : color(d.data.name)
}

const arcVisible = (d) => {
    let item = d.target ?? d
    return item.y1 <= 3 && item.y0 >= 1 && item.x1 > item.x0;
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

const showAlert = (target, data) => {
    return arcVisible(target) && data.alert
}

const tooltipContent = (d, tooltip, format) => {
    const { children, data } = d
    const { alert } = data
    let error = alert?.field ? `${alert.field}: ${alert.value}` : undefined

    tooltip.html(() => {
        let g = '<div style="font-size:10px;color:black;" align="left">'
        g = g + `<p>${data.header}: ${data.name}</p>`
        g = g + (children ? `<p>${data.childrenLabel}:  ${format(children.length)}</p>` : '')
        g = g + (error ? `<p>${error}</p>` : '')
        g = g + '</div>'
        return g
    });
    tooltip.style("visibility", "visible");
}

const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

const arcBorder = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1) + 5)

const updatePath = (path, pathBorder, label, update = false, t) => {
    let output = path
    let border = pathBorder
    if (update) {
        output = output.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            });

        border = pathBorder.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            });
    }

    output.attr("fill", d => (color(d.data.name)))
        .attr("fill-opacity", d => {
            let target = update ? d.target : d
            return arcVisible(target) ? (d.children ? 0.8 : 0.4) : 0
        })

    border.attr("fill", d => {
        let target = update ? d.target : d
        return showAlert(target, d.data) ? d.data.alert.color : 'transparent'
    })
        .attr("fill-opacity", d => {
            let target = update ? d.target : d
            return showAlert(target, d.data) ? 1 : 0
        })

    if (update) {
        output.attrTween("d", d => () => arc(d.current));
        border.attrTween("d", d => () => arcBorder(d.current))
        label.transition(t)
            .attrTween("transform", d => () => labelTransform(d.current))
            .attr("fill-opacity", d => +labelVisible(d.target));

    }
    else {
        output.attr("d", d => arc(d));
        border.attr("d", d => arcBorder(d))
        label.attr("fill-opacity", d => +labelVisible(d))
            .attr("transform", d => labelTransform(d))
    }
}

const Sunburst = (props) => {
    const { toggle, dataset, onClick, onUpdateSequence } = props
    const [dataFlow, setDataFlow] = useState([])
    const sbRef = useRef(null)

    const sunburstChart = (dataset) => {
        const format = d3.format(",d")
        const root = partition(dataset);

        //on click
        const clicked = (event, p) => {
            onClick(p.depth > 0 ? p.data : undefined)
            if (p.data.children) {
                onUpdateSequence(p)
                parent.datum(p.parent || root);

                // logo.style("visibility", p.depth === 0 ? "visible" : "hidden");

                root.each(d => d.target = {
                    x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                    x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                    y0: Math.max(0, d.y0 - p.depth),
                    y1: Math.max(0, d.y1 - p.depth)
                });

                // parentLabel.text(p.data.name).style('fill', 'white')

                const t = svg.transition().duration(750);

                path.style("cursor", (d) => { return arcVisible(d) ? "pointer" : 'default' })
                    .on('click', (e, d) => { return arcVisible(d) ? clicked(e, d) : undefined });
                updatePath(path, pathBorder, label, true, t)
            }

            //SequenceHorizontal
            var flow = [];
            var current = p;
            while (current.parent) {
                flow.unshift(current);
                current = current.parent;
            }
            setDataFlow(flow)

        }


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


        path.filter((d) => { return arcVisible(d) }).style("cursor", "pointer")
            .on('click', clicked);

        path.on("mouseover", (e, d) => {
            if (arcVisible(d)) {
                tooltipContent(d, tooltip, format)
            }
        })
            .on("mousemove", function (e, d) { return tooltip.style("top", (e.offsetY + 10) + "px").style("left", (e.offsetX + 30) + "px"); })
            .on("mouseout", function (e, d) { return tooltip.style("visibility", "hidden"); });

        const pathBorder = svg.append("g")
            .selectAll("path")
            .data(root.descendants().slice(1))
            .join("path")

        /**********
       * Label*
       **********/

        const label = svg.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
            .selectAll("text")
            .data(root.descendants().slice(1))
            .join("text")
            .attr("dy", "0.35em")
            .text(d => d.data.name.substring(0, 12) + (d.data.name.length > 12 ? '...' : ''))
            .style('font-size', 13)
            .style('fill', 'white')


        updatePath(path, pathBorder, label)

        const parent = svg.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", clicked)

        // const parentLabel = svg.append("text")
        //     .attr("class", "total")
        //     .attr("text-anchor", "middle")
        //     .attr('font-size', '1.7em')
        //     .attr('y', 12)
        //     .attr('x', 1)

        const logo = svg.append("svg:image")
            .attr('x', -50)
            .attr('y', -21)
            .attr('width', 100)
            .attr("xlink:href", "assets/brand/logo_small_x.png")
    }

    useEffect(() => {
        d3.select('#chart').remove()
        sunburstChart(dataset)
    }, [toggle]);

    return (
        <div align='center'>
            <div style={{ position: 'relative', width: '90%' }} ref={sbRef} />
            <div style={{ padding: '0px 10px 0px 20px' }} align='center'>
                <SequenceHorizontal key={uniqueId()} dataset={dataFlow} colors={color} />
            </div>
        </div>
    )
}

export default Sunburst