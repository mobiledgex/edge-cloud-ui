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
        const { classes, height } = this.props
        return (
            <div>
                {/* <Card style={{height:'calc(20vh - 6px)', marginBottom:1, width: 'calc(80vh - 80px)'}}>
                <SequenceFunnel sequence={sequence} onChange={this.onSequenceChange} width={300} key={uniqueId()}></SequenceFunnel>
                </Card> */}
                <Card style={{ width:'calc(80vh - 80px)'}}>
                    {/* <div style={{ height: 200 }}>
                        <SequenceFunnel sequence={sequence} onChange={this.onSequenceChange} width={200} key={uniqueId()}></SequenceFunnel>
                        <Divider style={{ height: 3, backgroundColor: '#202125' }} />
                    </div> */}
                    {/* <div style={{ width: 3, backgroundColor: '#202125' }} /> */}
                        <Sunburst sequence={sequence} dataset={dataset} toggle={toggle} onMore={this.onMore} />
                </Card>
            </div>
        )
    }

    componentDidUpdate() {

        console.log(this.props.height)
    }

    componentDidMount() {
    }
}

export default withStyles(controlStyles)(Control)