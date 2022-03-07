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
import { cloudletMetricsElements, cloudletUsageMetrics } from '../../../../services/modules/cloudletMetrics/cloudletMetrics';
import { appInstMetrics, appInstMetricsElements } from '../../../../services/modules/appInstMetrics';
import { authSyncRequest } from '../../../../services/service';
import { formatMetricData } from './metric';
import { appInstKeys } from '../../../../services/modules/appInst';
import { clusterInstKeys } from '../../../../services/modules/clusterInst';
import { clusterInstMetricsElements, clusterMetrics } from '../../../../services/modules/clusterInstMetrics';
import { AIK_APP_CLOUDLET_CLUSTER } from '../../../../services/modules/appInst/primary';
import { CIK_CLOUDLET_CLUSTER } from '../../../../services/modules/clusterInst/primary';
import { processWorker } from '../../../../services/worker/interceptor';

class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataset: undefined,
            toggle: false,
            showMore: undefined,
            resources: undefined
        }
    }

    fetchResources = async (show) => {
        if (show.data) {
            let data = show.data
            let numsamples = 1
            data.region = 'US'
            data.selector = '*'
            data.numsamples = numsamples
            if (show.field === fields.cloudletName || show.field === fields.appName || show.field === fields.clusterName) {
                let elements
                let request
                if (show.field === fields.cloudletName) {
                    elements = cloudletMetricsElements
                    request = cloudletUsageMetrics(this, data, true)
                }
                else if (show.field === fields.appName) {
                    elements = appInstMetricsElements
                    request = appInstMetrics(this, data, [appInstKeys(data, AIK_APP_CLOUDLET_CLUSTER)])
                }
                else {
                    elements = clusterInstMetricsElements
                    request = clusterMetrics(this, data, [clusterInstKeys(data, CIK_CLOUDLET_CLUSTER)])
                }
                let resources = {}
                await Promise.all(elements.map(async (element) => {
                    request.data.selector = element.selector ? element.selector : request.data.selector
                    let mc = await authSyncRequest(this, { ...request, format: false })
                    let metricData = formatMetricData(element, numsamples, mc)
                    if (metricData) {
                        if (element.selector === 'flavorusage' && metricData) {
                            const { flavorName, count } = metricData
                            if (flavorName) {
                                resources.flavor = { label: 'Flavor', value: `${flavorName.value} [${count ? count.value : 0}]` }
                            }
                        }
                        else {
                            resources = { ...resources, ...metricData }
                        }
                    }
                }))
                this.setState({ resources })
                return
            }
        }
        this.setState({ resources: undefined })
    }

    onMore = (show) => {
        this.setState({ showMore: show })
        if (show) {
            this.fetchResources(show)
        }
    }

    onSequenceChange = async (sequence) => {
        let response = await processWorker(this.props.worker, {
            region: 'US',
            rawList: this.props.rawList,
            sequence
        })
        if (response.status === 200) {
            this.setState({ dataset: response.data, toggle: !this.state.toggle })
        }

    }

    renderMarker = () => {

    }

    render() {
        const { toggle, showMore, dataset, resources } = this.state
        const { chartData, total, children } = this.props
        return (
            chartData ?
                <Grid container spacing={1}>
                    <Grid xs={7} item>
                        <div className='mex-card' align='center'>
                            <Sunburst sequence={sequence} dataset={dataset ? dataset : chartData} toggle={toggle} onMore={this.onMore} />
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

                                            {showMore ? <div style={{ marginTop: 20 }}>
                                                <h4 align='center' style={{ width: '100%' }}>{`${showMore.header}`}</h4>
                                                <Divider />
                                                <br />
                                                <h5>{`Name: ${showMore.name}`}</h5>
                                                <h5>{showMore.children ? `Total ${showMore.childrenLabel}: ${showMore.children.length}` : null}</h5>

                                            </div> :
                                                <div style={{ height: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                                    <h3 >Please select an option on sunburst to see details</h3>


                                                </div>

                                            }
                                        </Grid>
                                    </Grid>
                                    {resources ? <div style={{ padding: 10 }}>
                                        <h4>Resources</h4>
                                        <Divider />
                                        <br />
                                        {
                                            Object.keys(resources).map((key) => {
                                                let item = resources[key]
                                                return (

                                                    <div key={key} style={{ display: 'flex', gap: 10 }} align='left'>
                                                        <h4 style={{ fontWeight: 900, width: 150 }}>{item.label}</h4>
                                                        <h5>{item.value}</h5>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div> : null
                                    }
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                {children}
                            </Grid>
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