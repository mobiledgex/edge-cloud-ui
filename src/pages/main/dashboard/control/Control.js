import { Divider, Grid } from '@material-ui/core';
import React from 'react'
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import { formatData } from './format';
import './style.css'
import SequenceFunnel from '../../../../hoc/charts/d3/sequence/SequenceFunnel';
import { withStyles } from '@material-ui/styles';
import { controlStyles } from './control-styling'
import { uniqueId } from '../../../../helper/constant/shared';
import { sequence } from '../sequence';
import Total from '../total/Total';
import { fields } from '../../../../services';
import { cloudletMetrics } from '../../../../services/modules/cloudletMetrics/cloudletMetrics';
import { authSyncRequest } from '../../../../services/service';
class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataset: formatData(sequence),
            toggle: false,
            showMore: undefined
        }
    }

    onMore = (show) => {
        this.setState({ showMore: show })
        if(show.field === fields.cloudletName)
        {
            let data = show.data
            data.selector = '*'
            data.region = 'US'
            data.last=1
            authSyncRequest(this, cloudletMetrics(this, data))
            
        }
    }

    onSequenceChange = (sequence) => {
        this.setState({ dataset: formatData(sequence), toggle: !this.state.toggle })
    }

    renderMarker = () => {

    }

    render() {
        const { toggle, dataset, showMore } = this.state
        const { chartData, classes, height, total, children } = this.props
        return (
            chartData ?
                <Grid container spacing={1}>
                    <Grid xs={7} item>
                        <div className='mex-card' align='center'>
                            <Sunburst style={{ width: 'calc(85vh - 0px)' }} sequence={sequence} dataset={chartData} toggle={toggle} onMore={this.onMore} />
                        </div>
                    </Grid>
                    <Grid xs={5} item>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                {total ? <Total label='Cloudlet' data={total[fields.cloudletName]} /> : null}
                            </Grid>
                            <Grid item xs={4}>
                                {total ? <Total label='Cluster Instances' data={total[fields.clusterName]} /> : null}
                            </Grid>
                            <Grid item xs={4}>
                                {total ? <Total label='App Instances' data={total[fields.appName]} /> : null}
                            </Grid>
                            <Grid item xs={12}>
                                <div className='mex-card' style={{ height: 'inherit' }}>
                                    <Grid container spacing={1} >
                                        <Grid item xs={5}>
                                            <SequenceFunnel width='100%' sequence={sequence} onChange={this.onSequenceChange} key={uniqueId()}></SequenceFunnel>
                                        </Grid>
                                        <Grid item xs={7}>

                                            {showMore ? <div >
                                                <h4 align='center' style={{ width: '100%' }}>{`${showMore.header}`}</h4>
                                                <Divider />
                                                <br />
                                                <h5>{`Name: ${showMore.name}`}</h5>
                                                <h4>{`Total ${showMore.childrenLabel}: ${showMore.children.length}`}</h4>
                                            </div> :
                                                <h3 style={{width:100}}>Please select an option on sunburst to see details</h3>
                                            }
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            {children}
                        </Grid>
                    </Grid>
                </Grid>
                : null
        )
    }

    componentDidUpdate() {

    }

    componentDidMount() {
    }
}

export default withStyles(controlStyles)(Control)