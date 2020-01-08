import React from 'react';
import * as d3 from 'd3';
//redux
import { connect } from 'react-redux';

import './styles.css';

var data = {
    "name": "A1",
    "children": [
        {
            "name": "B1",
            "children": [
                {
                    "name": "Master",
                    "value": 400
                },
                {
                    "name": "Node",
                    "value": 200
                },
                {
                    "name": "Node",
                    "value": 200
                },
                {
                    "name": "Node",
                    "value": 200
                },
                {
                    "name": "Node",
                    "value": 200
                }
            ]
        }
    ]
};

class BubbleGroup extends React.Component {


    componentDidMount() {
        this.makeNode();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.clearNode();
        this.makeNode();
    }
    makeNode() {
        const getChild = (value, idx) => (
            {
                "name": value,
                "value": idx === 0 ? 200 : 200,
                "color": idx === 0 ? "#ff7d77" : "#a2cbff"
            }
        )
        let formValues = this.props.formValues;
        if(formValues && formValues.NumberOfNode) {
            let tempArray = []
            console.log('20191204.. vparseInt(formValues.NumberOfNode)  ', parseInt(formValues.NumberOfNode))
            for(let i = 0; i < parseInt(formValues.NumberOfNode)+1; i++){
                tempArray.push(i)
            }
            data = {
                "name": 'NO Name',
                "children": [
                    {
                        "name": "Master",
                        "children": tempArray.length ? tempArray.map((node, i) => getChild(formValues.ClusterName,i)) : ''
                    }
                ]
            };
        }
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
            .style('fill', function(d) { return d.data.color; })
            .style('opacity', 0.6)

        nodes
            .append('text')
            .attr('dy', 4)
            .text(function(d) {
                return d.children === undefined ? d.data.name : '';
            })
    }
    clearNode() {
        var nodes = d3.select('svg g')
            .selectAll('g')
            .remove()


    }
    render() {
        return (
            <svg className="chart-circle" width="300" height="300">
                <text>{this.props.data ? this.props.data.name : ''}</text>
                <g></g>
            </svg>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let formValues = null;
    if(state.form.createAppFormDefault) {
        formValues = state.form.createAppFormDefault.values;
        if(formValues) console.log('20191204 formValues---', formValues)
    }
    return {
        formValues: formValues
    };
};

export default connect(mapStateToProps, null)(BubbleGroup);
