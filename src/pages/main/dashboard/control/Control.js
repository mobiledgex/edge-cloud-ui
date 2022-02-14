import { Card, Checkbox, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react'
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import { formatData, sequence1 } from './format';
import './style.css'
import SequenceFunnel from '../../../../hoc/charts/d3/sequence/SequenceFunnel';
import { withStyles } from '@material-ui/styles';
import { controlStyles } from './control-styling'
import { uniqueId } from '../../../../helper/constant/shared';
import Tooltip from './Tooltip'
import Doughnut from '../../../../hoc/charts/d3/doughnut/Doughnut';
import { sequence } from '../sequence';
class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataset: formatData(sequence1),
            toggle: false,
            showMore: false
        }
    }

    onMore = (show) => {
        this.setState({ showMore: show })
    }

    onSequenceChange = (sequence) => {
        this.setState({ dataset: formatData(sequence), toggle: !this.state.toggle })
    }

    renderMarker = () => {

    }

    render() {
        const { toggle, dataset } = this.state
        const { chartData, classes, height } = this.props
        return (
            chartData ? <div id='mex-sunburst-container' className='mex-card'>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '70%' }}>
                        <Sunburst sequence={sequence} dataset={chartData} toggle={toggle} onMore={this.onMore} />
                    </div>
                    <SequenceFunnel sequence={sequence} onChange={this.onSequenceChange} key={uniqueId()}></SequenceFunnel>
                </div>
            </div> : null
        )
    }

    componentDidUpdate() {

    }

    componentDidMount() {
    }
}

export default withStyles(controlStyles)(Control)