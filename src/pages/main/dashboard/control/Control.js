import { Card, Checkbox, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react'
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import { formatData, sequence } from './format';
import './style.css'
import SequenceFunnel from '../../../../hoc/charts/d3/sequence/SequenceFunnel';
import { withStyles } from '@material-ui/styles';
import { controlStyles } from './control-styling'
import { uniqueId } from '../../../../helper/constant/shared';

class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataset: formatData(sequence),
            toggle: false,
            height: 0,
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
        const { height, toggle, dataset } = this.state
        const { classes } = this.props
        return (
            <div style={{ width: '100%' }}>
                <Card style={{ width: 'inherit', display: 'inline-flex' }}>
                    <div style={{ width: '47%' }}>
                        <SequenceFunnel sequence={sequence} onChange={this.onSequenceChange} width={310} key={uniqueId()}></SequenceFunnel>
                        <Divider style={{ height: 3, backgroundColor: '#202125' }} />
                    </div>
                    <div style={{ width: 3, backgroundColor: '#202125' }} />
                    <div style={{ width: '53%' }}>
                        <Sunburst sequence={sequence} dataset={dataset} toggle={toggle} onMore={this.onMore} />
                    </div>
                </Card>
            </div>
        )
    }

    componentDidUpdate() {

    }

    componentDidMount() {
        console.log(this.state.dataset)
    }
}

export default withStyles(controlStyles)(Control)