import React from 'react';
import * as d3 from 'd3';

const b = { w: 115, h: 30, s: 3, t: 10 };

const breadcrumbPoints = (d, i) => {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  points.push(b.t + "," + (b.h / 2));
  return points.join(" ");
}

class SequenceHorizontal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dataset: []
    }
    this.shRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (props.dataset !== state.dataset) {
      return { dataset: props.dataset }
    }
    return null
  }

  draw = (data) => {
    const { colors } = this.props
    var svg = d3.select(this.shRef.current)
      .append('svg')
      .attr("width", data.length * 135)
      .attr("height", 50)

    var g = svg
      .selectAll("g")
      .data(data, function (d) { return d; });
    var entering = g.enter().append("svg:g");

    entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function (d) { return colors(d.data.name); })
      .style("fill-opacity", 0.1);


    entering.append('svg:text')
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(d => d.data.name.substring(0, 11) + (d.data.name.length > 11 ? '...' : ''))
      .attr('font-weight', 900)
      .attr('font-size', 13)
      .attr('fill', function (d) { return colors(d.data.name) });

    entering.attr("transform", function (d, i) {
      return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    g.exit().remove()

  }

  render() {
    return (
      <div id='sequence-horizontal' ref={this.shRef} ></div>
    );
  }

  componentDidMount() {
    this.draw(this.state.dataset);
  }
}

export default SequenceHorizontal;
