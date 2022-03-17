import React from 'react';
import { perpetual } from '../../../../../helper/constant';
import { equal } from '../../../../../helper/constant/operators';
export { default as bullet } from './bullet';
const d3 = require('d3');
import './style.css';


const margin = { top: 7, right: 40, bottom: 12, left: 10 };
const width = 200 - margin.left - margin.right;
const height = 35 - margin.top - margin.bottom;

//rangers - total allotted
//measures - used, allotted
//markers - total used

const update = (object, data) => {
    var svg = d3.select(object).selectAll('svg')
    svg.remove()
    bulletChart(object, data)
}
const bulletChart = (object, data) => {
    var chart = d3.bullet()
        .width(width)
        .height(13);

    var svg = d3.select(object).selectAll('svg')
        .data(data)
        .enter().append('svg')
        .attr('class', 'bullet')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(chart);

    var title = svg.append('g')
        .style('text-anchor', 'end')
        .attr('transform', `translate(-6,${(height / 2)})`);

    title.append('text')
        .attr('class', 'title')
        .text(function (d) { return d.title; });

    title.append('text')
        .attr('class', 'subtitle')
        .attr('dy', '1em')
        .text(function (d) { return d.subtitle; });


}

class BulletChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.myRef = React.createRef();
    }

    render() {
        const { onHover, data, column } = this.props
        return (
            <React.Fragment>
                <div ref={this.myRef} id={this.props.id} onMouseEnter={(e) => { onHover && onHover(e, { type: perpetual.CHART_BULLET, data: data[0], column }) }} onMouseLeave={() => { onHover && onHover() }}></div>
            </React.Fragment>
        );
    }

    componentDidUpdate(preProps, preState) {
        if (!equal(this.props.data, preProps.data)) {
            update(this.myRef.current, this.props.data)
        }
    }

    componentDidMount() {
        bulletChart(this.myRef.current, this.props.data)
    }
}

export default BulletChart