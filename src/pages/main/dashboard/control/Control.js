import React from 'react'
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import SequenceFunnel from '../../../../hoc/charts/d3/sequence/SequenceFunnel';
import { withStyles } from '@material-ui/styles';
import { controlStyles } from './styles/control-styling'
import { uniqueId } from '../../../../helper/constant/shared';
import { sequence } from './services/sequence';
import { fields } from '../../../../services';
import { processWorker } from '../../../../services/worker/interceptor';
import DashbordWorker from './services/dashboard.worker.js';
import Total from './total/Total';
import { fetchShowData, fetchSpecificResources } from './services/service';
import './styles/style.css'
import clsx from 'clsx';
import { Divider, Grid } from '@material-ui/core';
import { Header1 } from '../../../../hoc/mexui/headers/Header1';
import Resources from './total/Resources';

const states = [
    {label:'Success', color:'#66BC6A'},
    {label:'Transient', color:'#AE4140'},
    {label:'Error', color:'#D99E48'},
]
class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData: undefined,
            rawList: undefined,
            total: undefined,
            dataset: undefined,
            toggle: false,
            showMore: undefined,
            resources: undefined
        }
        this.worker = new DashbordWorker()
    }

    fetchResources = async (item) => {
        this.setState({ resources: await fetchSpecificResources(this, item) })
    }

    onMore = (show) => {
        this.setState({ showMore: show })
        if (show) {
            this.fetchResources(show)
        }
    }

    onSequenceChange = async (sequence) => {
        let response = await processWorker(this, this.worker, {
            rawList: this.state.rawList,
            sequence
        })
        if (response?.status === 200) {
            this.setState({ dataset: response.data, toggle: !this.state.toggle })
        }

    }

    renderMarker = () => {

    }

    render() {
        const { toggle, showMore, dataset, total, resources } = this.state
        const { children } = this.props
        return (
            <div className='control'>
                <div className={clsx('col-left', 'mex-card')} >
                    <div className='sunburst'>
                        {dataset ? <Sunburst sequence={sequence} dataset={dataset} toggle={toggle} onMore={this.onMore} /> : null}
                    </div>
                </div>
                <div className='col-right'>
                    <div className='content1'>
                        <div className='mex-card'>
                            <SequenceFunnel sequence={sequence} onChange={this.onSequenceChange} key={uniqueId()}></SequenceFunnel>
                        </div>
                        {total ? <div className='total'>
                            <Total label='Cloudlet' data={total[fields.cloudletName]} />
                            <Total label='Cluster Instances' data={total[fields.clusterName]} />
                            <Total label='App Instances' data={total[fields.appName]} />
                        </div> : null}
                    </div>
                    {
                        showMore ? <div className={clsx('content2')}>
                         
                            <div style={{ paddingLeft: 10 }}>
                                <Header1 size={14}>{`${showMore.header}`}</Header1>
                            </div>
                            <Divider />
                            <div style={{ padding: 10}}>
                            <Grid container>
                                <Grid item xs={6}>
                                <h5>{`Name: ${showMore.name}`}</h5>
                                <h5>{showMore.children ? `Total ${showMore.childrenLabel}: ${showMore.children.length}` : null}</h5>
                                </Grid>

                                <Grid item xs={6}>
                                {resources ? <div style={{ padding: 10 }}>
                                    <Resources data={resources}></Resources>
                                    

                                </div> : null
                                }
                                </Grid>
                            </Grid>
                            </div>
                        </div> : null
                    }
                    {children}
                </div>
            </div>
        )
    }

    componentDidUpdate() {

    }

    fetchInitData = async () => {
        let response = await fetchShowData(this, this.worker)
        if (response?.status === 200) {
            const { data: dataset, total, dataList: rawList } = response
            this.setState({ dataset, total: total, rawList })
        }
    }

    componentDidMount() {
        this.fetchInitData()
    }
}

export default withStyles(controlStyles)(Control)