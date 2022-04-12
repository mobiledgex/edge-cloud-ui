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
import * as d3 from 'd3';

const CON_WIDTH = 38
const COLOR_GREEN = '#388E3C'
const COLOR_RED = '#757575'
/***********
**w:width;**
**h:height**
**s:space***
**t:vertex**/
const b = { w: 24, h: 20, s: 6, t: 12 };

const breadCrumbColor = (flag) => {
  return flag ? COLOR_GREEN : COLOR_RED
}

const breadcrumbPoints = (d, i, length) => {
  let j = length - i
  let w = (b.w * length) + i * b.t
  w = w + (2 * i)
  let points = [];
  points.push(3 + j * b.t + ",0");
  points.push(w + b.t + ",0");
  points.push(w + "," + b.h);
  points.push(b.t + j * b.t + "," + b.h);

  return points.join(" ");
}

export const updateElements = (sequence, onSwap) => {
  let swap = undefined
  let g = d3.select("#trail")
    .selectAll("g")
    .data(sequence, (d) => { return `${Math.random()}_${d.field}` });
  let entering = g.enter().append("svg:g");

  //add polygon
  entering.append("svg:polygon")
    .attr("points", (d, i) => { return breadcrumbPoints(d, i, sequence.length) })
    .style('display', 'inline')
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", '5px')
    .attr("stroke", function (d, i) { return breadCrumbColor(d.active) })
    .style("fill", function (d, i) { return breadCrumbColor(d.active) })


  //add label
  entering.append('svg:text')
    .attr("x", ((b.w * sequence.length) + b.t) / 2)
    .attr("y", b.h / 2)
    .attr("dy", "0em")
    .attr("dx", 6 * sequence.length)
    .style("font-size", "12px")
    .style("font-weight", "700")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .text((d) => { return d.label; })
    .attr('fill', 'white');

  entering.attr("transform", function (d, i) {
    let j = sequence.length - i
    return "translate(0," + (j * (b.h + b.s) + 10) + ")";
  });

  entering.on("mouseover", function () { })
  entering.style("cursor", "pointer").on('click', (e, d) => {
    if (swap === undefined) {
      swap = d
      d3.selectAll('polygon').filter((d1) => { return d1.field !== d.field }).style('opacity', 0.3)
    }
    else {
      var index1 = sequence.indexOf(swap)
      var index2 = sequence.indexOf(d)
      sequence.splice(index1, 1);
      sequence.splice(index2, 0, swap);
      onSwap && onSwap(sequence)
      updateElements(sequence, onSwap)
    }
  })
  g.exit().remove()
}

class Sequence extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
    this.sbRef = React.createRef();
    this.width = props.width ?? CON_WIDTH * props.sequence.length
  }

  render() {
    return (
      <div id='sequencefunnel' ref={this.sbRef} style={{ width: this.width }}></div>
    );
  }

  initialize = () => {
    const { sequence } = this.props
    d3.select(this.sbRef.current)
      .append('svg')
      .attr("id", "trail")
      .attr("width", this.width)
      .attr("height", 36 * sequence.length)
      .attr('align', 'center')
  }

  sequenceDiagram = () => {
    const { sequence, onChange } = this.props
    this.initialize();
    updateElements(sequence, onChange);
  }

  componentDidMount() {
    this.sequenceDiagram()
  }
}

export default Sequence;
