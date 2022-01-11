import { Card } from '@material-ui/core';
import React from 'react'
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import Tooltip from './Tooltip'
import { formatData, sequence } from './format';
import './style.css'
import Sequence from '../../../../hoc/charts/d3/sequence/SequenceFunnel';

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

    render() {
        const { height, toggle, dataset, showMore } = this.state
        return (
            <React.Fragment>
                <div id='sunburst-container' style={{ width: 'calc(95vh - 64px)' }}>
                    <Tooltip height={height} show={showMore} onClose={this.onMore}>
                        {showMore ? null : <Sequence sequence={sequence} onChange={this.onSequenceChange} />}
                    </Tooltip>
                    <Sunburst sequence={sequence} dataset={dataset} toggle={toggle} onMore={this.onMore} />
                </div>
            </React.Fragment>
        )
    }

    componentDidUpdate() {
        let height = document.getElementById('sunburst-container').scrollHeight
        if (this.state.height !== height) {
            this.setState({ height })
        }
    }

    componentDidMount() {
        let height = document.getElementById('sunburst-container').scrollHeight
        this.setState({ height })
    }
}

export default Control