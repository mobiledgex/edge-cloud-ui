import React from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import _ from 'lodash';


// https://bl.ocks.org/mbostock/7004f92cac972edef365

let _self = null;
export default class InterpolNumber extends React.Component {
    constructor() {
        super();
        _self = this;
        this.state = {

        }
        this.randomRange = 1000;
        this.timeout = setTimeout(() => this.randomRange = 100000, 1500)
    }
    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    componentDidMount() {

        var format = d3.format((this.props.format)? this.props.format:",d");
        var self = this;


            d3.select('#'+this.props.sId)
                .transition()
                .duration(1000)
                .on("start", function repeat() {
                    d3.active(this)
                        .tween("text", function() {
                            var that = d3.select(this),
                                i = d3.interpolateNumber(that.text().replace(/,/g, ""), self.getValue());
                            return function(t) { that.text(format(i(t))); };
                        })
                        .transition()
                        .delay((self.props.value)?0:5000)
                        .on("start", repeat);
                });





    }


    getValue = () => ((this.props.value) ? this.props.value : Math.random() * this.randomRange)

    render() {
        let { sId, value } = this.props;
        return (
            <div className={this.props.className} id={sId}/>

        )
    }
}
InterpolNumber.defaultProps = {
    sId: String(Math.random()*1000000),
    w:200,
    h:80
}
