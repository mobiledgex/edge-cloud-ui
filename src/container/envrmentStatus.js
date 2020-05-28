import React, { Component } from 'react';
import { Grid, List, Label, Table, Icon, Card } from 'semantic-ui-react';
import Gauge from '../chartGauge/gauge';
import * as d3 from "d3";


const formatInt = d3.format(".0f");
const formatComma = d3.format(",");
const formatFloat = d3.format(".2f");
const formatPercent = d3.format(".1f",".1f");

class EnvironmentStatus extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        }
        //임계치 설정에 따라 컬러값 변경 필요
        this.sectionsProps_temp = [
            { fill: '#4ef43d', stroke: '#4ef43d' },
            { fill: '#4ef43d', stroke: '#4ef43d' },
            { fill: '#fad91d', stroke: '#fad91d' },
            { fill: '#db970b', stroke: '#db970b' },
            { fill: '#28dba1', stroke: '#28dba1' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' }
        ];

        this.legend_temp = ['1.0', '', '1.3', '', '1.5', '', '1.7', '', '1.9', '2.0', '2.1', '2.2', '2.3', '2.4', '2.5'];
        this.sectionsProps_humi = [
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#F46806', stroke: '#F46806' },
            { fill: '#db970b', stroke: '#db970b' },
            { fill: '#fad91d', stroke: '#fad91d' },
            { fill: '#4ef43d', stroke: '#4ef43d' },
            { fill: '#28dba1', stroke: '#28dba1' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#4ef43d', stroke: '#4ef43d' },
            { fill: '#fad91d', stroke: '#fad91d' },
            { fill: '#fad91d', stroke: '#fad91d' },
            { fill: '#F46806', stroke: '#F46806' },
            { fill: '#F46806', stroke: '#F46806' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' }
        ];

        this.legend_humi = ['', '10', '', '20', '', '30', '', '40', '', '50',
            '', '60', '', '70', '', '80', '', '90', '', '%'];
    }


    chartComponent = (props, type, title) => (

        <Gauge data={props ? props : null} type={type} label={title} unit={'℃'}
               limits={props ? props: {}}
               sections={this.sectionsProps_temp} legend={this.legend_temp}
        />

    )
    getOfficeName = (data, i) => {
        if(data && data.rows[i]) {
            let key = Object.keys(data.rows[i])[0];
            return data.headers[key];
        } else {
            return null;
        }

    }

    getHasData = (data, i) => {
        console.log('20190927 getHasData data...', formatFloat(data))
        if(data) {
            return formatInt(data)

        } else {
            return null;
        }

    }
    
    UNSAFE_componentWillReceiveProps(nextProps) {
        let self = this;
        setTimeout(function(){self.setState({data: nextProps.data})}, 1500)
    }
    render() {

        return (
            <div className="cloudlet_monitoring_charts_gauge_wrapper">
                {this.chartComponent((this.state.data && this.state.data.length) ? this.state.data : null, this.props.type ,this.props.title)}
            </div>
        )
    }
}

export default EnvironmentStatus;
