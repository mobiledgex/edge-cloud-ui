import React from 'react';
import * as d3 from "d3";
import moment from 'moment';

let cnt = 0;
let oldids = [];
export default class ClusterIcon extends React.Component {

    getLevel = (value) => {
        let level = 1;
        if (value < 2) {
            level = 1;
        } else if(value >= 2 && value < 4 ) {
            level = 2;
        } else if(value >= 4 && value < 6) {
            level = 3;
        } else if(value >= 6 && value < 8) {
            level = 4;
        } else if(value >= 8){
            level = 5;
        }

        return level;
    }
    getIcon (domId, level) {

        let src;
        switch(level) {
            case 1: src = '/assets/cluster/cluster_level1.svg'; break;
            case 2: src = '/assets/cluster/cluster_level2.svg'; break;
            case 3: src = '/assets/cluster/cluster_level3.svg'; break;
            case 4: src = '/assets/cluster/cluster_level4.svg'; break;
            case 5: src = '/assets/cluster/cluster_level5.svg'; break;
            default: src = '/assets/cluster/cluster_level1.svg'; break;
        }

        let rndid = 'iconCl_'+Math.round(Math.random()*1000);


        d3.select(domId).select('svg').remove();

        setTimeout(() => {
            d3.svg(src).then((svg) => {
                const gElement = d3.select(svg).select('svg');
                gElement.attr('id', rndid)
                if(d3.select(domId).node()) d3.select(domId).node().append(gElement.node());
            })
        }, 500)



    }
    componentWillReceiveProps(nextProps, nextContext) {
        //console.log('this.props.uValues is refresh ==== ', nextProps.idx, ';   '+nextProps.uValues)
        //this.getIcon('#icon_'+nextProps.idx, this.getLevel(parseInt(nextProps.uValues)))

    }

    componentDidMount() {

        this.getIcon('#icon_'+this.props.idx, this.getLevel(parseInt(this.props.uValues)))
    }
    render() {
        let {idx} = this.props;
        return (
            <div id={"icon_"+idx} className='cluster_icon' />
        )
    }
}
