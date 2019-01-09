import React from 'react'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom';
import Radial from './Radial';

let self = null;
class RainbowCircle extends React.Component {
    constructor() {
        super();
        self = this;
    }
    componentDidMount () {
        const faux = this.props.connectFauxDOM('div', 'chart')
        // d3.select(faux)
        //     .append('div')
        //     .html('Hello World!')



        var π = Math.PI,
            τ = 2 * π,
            n = 500;

        var width = 136,
            height = 136,
            outerRadius = width / 2 - 2,
            innerRadius = outerRadius - 12;
        let svg = d3.select(faux).append('svg')
            .attr("width", width)
            .attr("height", height)

        // svg.append("g")
        //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        //     .selectAll("path")
        //     .data(d3.range(0, τ-0.5, τ / n))
        //     .enter().append("path")
        //     .attr("d", arc)
        //     .style("fill", function(d) { return d3.hsl(d * 360 / τ, 1, .5); });

        this.renderSections(svg)

        this.props.animateFauxDOM(800)
    }
    //////////////////////////
    //참고 : https://codepen.io/anon/pen/QryPoQ
    static propTypes = {
        guageData: React.PropTypes.array,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        sections: React.PropTypes.array
    };

    percentToDeg = (perc) => {
        return perc * 360;
    };

    percentToRad = (perc) => {
        return this.degToRad(this.percentToDeg(perc));
    };

    degToRad = (deg) => {
        return deg * Math.PI / 180;
    };

    renderSections = (svg) => {
        const margin = { left: 0, right: 0, top: 0, bottom: 0 };

        const width = Math.round(this.props.width - (margin.left + margin.right));
        const height = Math.round(this.props.height - (margin.top + margin.bottom));

        const radius = Math.min(this.props.width, this.props.height) / 2;
        const dist = 1.325; // 2 = 180도
        const sectionPerc = 1 / this.props.sections.length / dist;
        const padRad = 0.01; //패스와 패스사이 간격

        let totalPercent = 0.5 + 0.125; // 좌측 아래부터
        const chartInset = 12;// 숫자 높으면 원이 안으로 줄어듬
        const barWidth = 5;

        const transform = `translate(${self.props.width / 2}, ${height / 2})`;

        var svg2 = svg.append("g")
            .attr("transform", transform)


        var meter = svg2.append("g")
            .attr("class", "progress-meter")

        this.props.sections.map((sectionProps, index) => {
            const arcStartRad = self.percentToRad(totalPercent);
            const arcEndRad = arcStartRad + self.percentToRad(sectionPerc);
            totalPercent += sectionPerc;

            const startPadRad = index === 0 ? 0 : padRad / 2;
            const endPadRad = index === self.props.sections.length ? 0 : padRad / 2;




            const arc = d3.arc()
                .innerRadius(radius - chartInset - barWidth)
                .outerRadius(radius - chartInset)
                .startAngle(arcStartRad + startPadRad)
                .endAngle(arcEndRad - endPadRad);


                meter.append("path")
                .attr("id", "gauge-path-"+this.props.type+"-" + index)
                .attr("d", arc)
                .attr("fill", sectionProps.fill)

            // Legend
            if (this.props.legend) {
                let text = meter.append("text")
                    .attr("x", (this.props.type === 'temp') ? 7 : 1) //글자의 시작 위치 좌=0
                    .attr("dy", -2); //패스 밖으로 표현

                text.append("textPath")
                    .attr("class","gauge-text")
                    .attr("xlink:href","#gauge-path-"+this.props.type+"-"  + index)
                    .text(this.props.legend[index]);
            }


            meter.transition();


        });


    };




    //////////////////////////
    render () {
        return (
            <div style={{position:'absolute', top:24, left:23}}>
                <div className='renderedD3'>
                    {this.props.chart}
                </div>
            </div>
        )
    }
}

RainbowCircle.defaultProps = {
    chart: 'loading',
    type:'temp',
    width: 136,
    height:136
}

export default withFauxDOM(RainbowCircle)