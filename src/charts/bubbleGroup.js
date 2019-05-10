import React from 'react';
import * as d3 from 'd3';
import './styles.css';

var data = {
    "name": "A1",
    "children": [
        {
            "name": "B1",
            "children": [
                {
                    "name": "C1",
                    "value": 200
                },
                {
                    "name": "C2",
                    "value": 300
                },
                {
                    "name": "C3",
                    "value": 200
                },
                {
                    "name": "C4",
                    "value": 200
                },
                {
                    "name": "C5",
                    "value": 200
                }
            ]
        },
        {
            "name": "B2",
            "value": 200
        }
    ]
};
export default class BubbleGroup extends React.PureComponent {
    componentDidMount() {
        var packLayout = d3.pack()
            .size([300, 300]);

        var rootNode = d3.hierarchy(data)

        rootNode.sum(function(d) {
            return d.value;
        });

        packLayout(rootNode);

        var nodes = d3.select('svg g')
            .selectAll('g')
            .data(rootNode.descendants())
            .enter()
            .append('g')
            .attr('transform', function(d) {return 'translate(' + [d.x, d.y] + ')'})

        nodes
            .append('circle')
            .attr('r', function(d) { return d.r; })

        nodes
            .append('text')
            .attr('dy', 4)
            .text(function(d) {
                return d.children === undefined ? d.data.name : '';
            })
    }

    render() {
        return (
            <svg className="chart-circle" width="320" height="320">
                <g></g>
            </svg>
        )
    }
}
