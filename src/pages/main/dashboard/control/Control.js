import { Card } from '@material-ui/core';
import React from 'react'
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import Tooltip from './Tooltip'
import { formatData, sequence } from './format';

class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataset: formatData(sequence),
            toggle: false,
            height:0,
            showMore:false
        }
    }

    onMore = (show)=>{
        this.setState({showMore:show})
    }

    render() {
        const { height, toggle, dataset, showMore } = this.state
        return (
            <React.Fragment>
                <Card id='sunburst-container' style={{ width: 'calc(95vh - 21px)' }}>
                    <Tooltip height={height} show={showMore} onClose={this.onMore}></Tooltip>
                    <Sunburst sequence={sequence} dataset={dataset} toggle={toggle} onMore={this.onMore}/>
                </Card>
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