import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
import {Segment, Dimmer} from "semantic-ui-react";
import { ScaleLoader } from 'react-spinners';
import Solidgauge from 'highcharts/modules/solid-gauge';
import Barchart from './options/barchart';
import Columnchart from './options/columnChart';
import Gaugechart from './options/gaugeChart';
import Polarchart from './options/polarChart';
import Linechart from './options/lineChart';


Solidgauge(ReactHighcharts.Highcharts);
HighchartsMore(ReactHighcharts.Highcharts);

/**
* https://github.com/kirjs/react-highcharts
**/
class HighCharts extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:null,
            chartRpm: null,
            activeDimmer: false
        }
        ReactHighcharts.Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        let self = this;
        if(nextProps.data) {
            this.setState({data:nextProps.data, activeDimmer: false});
            setTimeout(() => {self.renderChart()}, 1000);
        }
    }
    componentDidMount() {

    }
    renderChart() {
        //let chart = this.refs.chart.getChart();
        //chart.series[0].addPoint({x: 10, y: 12});
        // Bring life to the dials
        var point,
            newVal,
            inc;

        function resetChart(chart) {

            while(chart.series.length > 0) {
                chart.legend.destroyItem(chart.series[0]);
                chart.series[0].remove(true);

            }
            chart.redraw();
            for(var i=0; i<2; i++){
                chart.addSeries({
                    showInLegend: true,
                    name: '',
                    data: []
                });
            }

        }
        function resetData (self) {
            /************
             * gaugeChart
             *************/
            if (global.chartRpm) {
                point = global.chartRpm.series[0].points[0];
                inc = Math.random() - 0.5;
                newVal = point.y + inc;

                if (newVal < 0 || newVal > 5) {
                    newVal = point.y - inc;
                }

                point.update(newVal);
                setTimeout(function(){
                    resetData (self);
                }, 2000)
            }
            /************
             * columnChart
             *************/
            if (self.props.chart == 'column' && self.barChart) {
                const chart = self.barChart.getChart()
                if(chart && self.state.data) {
                    resetChart(chart);
                    chart.xAxis[0].setCategories(self.state.data.value.categories);
                    chart.xAxis[0].update();
                    // chart.legend.update({
                    //     align: 'right',
                    //     verticalAlign: 'top',
                    //     layout: 'vertial',
                    //     x: 0,
                    //     y: 50,
                    //     enabled: true
                    // })
                    chart.yAxis[0].update({
                        stackLabels: {
                            enabled: true
                        }
                    })


                    chart.isDirtyLegend = true;
                    self.state.data.value.serise.map((value, i)=>{
                        chart.series[i].update(value, true);
                    })
                }


                setTimeout(function(){
                    resetData (self);
                }, 1000*60*60*6)
            }
        };
        var _self = this;
        setTimeout(function(){
            resetData (_self);
        }, 2000)
    }
    render() {
        let {chart} = this.props;
        return (
            <Dimmer.Dimmable as={Segment} dimmed={this.state.activeDimmer}>
                <Dimmer active={this.state.activeDimmer} inverted>
                    <ScaleLoader
                        color={'#123abc'}
                        loading={true}
                    />
                </Dimmer>

                <div className='chartContainer' style={{height:'100%'}}>
                    {
                        (chart === 'gauge') ? <ReactHighcharts config={Gaugechart} ref={ref => this.gaugeChart = ref}></ReactHighcharts>
                            : (chart === 'polar') ? <ReactHighcharts config={Polarchart}ref={ref => this.polarChart = ref}></ReactHighcharts>
                            : (chart === 'column') ? <ReactHighcharts config={Columnchart}  ref={ref => this.barChart = ref}></ReactHighcharts>
                            : (chart === 'line') ? <ReactHighcharts config={Linechart} ref={ref => this.lineChart = ref}></ReactHighcharts> : <ReactHighcharts config={Barchart} ref={ref => this.barChart = ref}></ReactHighcharts>
                    }
                </div>
            </Dimmer.Dimmable>

        );
    }
}

export default HighCharts;
