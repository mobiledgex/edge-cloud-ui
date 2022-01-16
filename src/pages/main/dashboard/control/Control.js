import { Card, CardContent, Grid } from '@material-ui/core';
import React from 'react'
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import Tooltip from './Tooltip'
import { formatData, sequence } from './format';
import './style.css'
import Sequence from '../../../../hoc/charts/d3/sequence/SequenceFunnel';
import { withStyles } from '@material-ui/styles';
import {controlStyles} from './control-styling'
import MexMap from '../../../../hoc/mexmap/MexMap';

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
        const { classes } = this.props
        let gridHeight = (height-212)/2
        return (
            <React.Fragment>
                <div id='mex-dashboard-control' style={{ width: 'calc(54vw - 7px)' }}>
                    {/* <Tooltip height={height} show={showMore} onClose={this.onMore}> */}
                        {/* {showMore ? null :  <Sequence sequence={sequence} onChange={this.onSequenceChange}/>} */}
                    {/* </Tooltip> */}
                    <Sunburst sequence={sequence} dataset={dataset} toggle={toggle} onMore={this.onMore} />
                </div>
                <div style={{ height:height, width: '32vw', marginLeft: 1 }}>
                    <Grid container>
                        <Grid item xs={6} >
                            <Card className={classes.widgets} style={{height:210}}>
                                <Sequence sequence={sequence} onChange={this.onSequenceChange}></Sequence>
                            </Card>
                        </Grid>
                        <Grid item xs={6} >
                            <Card className={classes.widgets} style={{height:210}}>
                                <CardContent>dddd</CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container style={{margin:1}}>
                        <Grid item xs={12} >
                            <Card className={classes.widgets1} style={{height:gridHeight}}>
                                <MexMap zoom={3}></MexMap>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container style={{margin:1}} >
                        <Grid item xs={12} >
                            <Card className={classes.widgets1} style={{height:gridHeight}}>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        )
    }

    componentDidUpdate() {
        let height = document.getElementById('mex-dashboard-control').scrollHeight
        if (this.state.height !== height) {
            this.setState({ height })
        }
    }

    componentDidMount() {
        let height = document.getElementById('mex-dashboard-control').scrollHeight
        this.setState({ height })
    }
}

export default withStyles(controlStyles)(Control)