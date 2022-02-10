import React from 'react';
import * as d3 from 'd3';
import { uniqueId } from '../../../../helper/constant/shared';

const CON_WIDTH = 170

/***********
**w:width;**
**h:height**
**s:space***
**t:vertex**/
const b = { w: 100, h: 20, s: 6, t: 12 };

const breadcrumbPoints = (d, i, j) => {
  var w = b.w + i * b.t
  w = w + (2 * i)
  var points = [];
  points.push(3 + j * b.t + ",0");
  points.push(w + b.t + ",0");
  points.push(w + "," + b.h);
  points.push(b.t + j * b.t + "," + b.h);

  return points.join(" ");
}

export const updateElements = (sequence, onSwap) => {
  var swap = undefined
  var g = d3.select("#trail")
    .selectAll("g")
    .data(sequence, (d) => { return `${Math.random()}_${d.field}` });
  var entering = g.enter().append("svg:g");

  //add polygon
  entering.append("svg:polygon")
    .attr("points", (d, i) => { return breadcrumbPoints(d, i, sequence.length - i) })
    .style('display', 'inline')
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", '5px')
    .attr("stroke", function (d, i) { return i < 2 ? '#43A56E' : '#757575' })
    .style("fill", function (d, i) { return i < 2 ? '#43A56E' : '#757575' })


  //add label
  entering.append('svg:text')
    .attr("x", (b.w + b.t) / 2)
    .attr("y", b.h / 2)
    .attr("dy", "0.35em")
    .attr("dx", "1.5em")
    .style("font-size", "12px")
    .style("font-weight", "700")
    .attr("text-anchor", "middle")
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
    this.width = props.width ? props.width : CON_WIDTH
  }

  render() {
    return (
      <div id='sequencefunnel' key={uniqueId()} ref={this.sbRef} style={{ width: this.width }}></div>
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
