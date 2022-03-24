import React from 'react'
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import SequenceFunnel from '../../../../hoc/charts/d3/sequence/SequenceFunnel';
import { localFields } from '../../../../services/fields';
import { withStyles } from '@material-ui/styles';
import { controlStyles } from './styles/control-styling'
import { uniqueId } from '../../../../helper/constant/shared';
import { sequence } from './services/sequence';
import { processWorker } from '../../../../services/worker/interceptor';
import DashbordWorker from './services/dashboard.worker.js';
import Total from './total/Total';
import { fetchShowData, fetchSpecificResources } from './services/service';
import { Divider, Grid } from '@material-ui/core';
import { Header1 } from '../../../../hoc/mexui/headers/Header1';
import Resources from './total/Resources';
import { toFirstUpperCase } from '../../../../utils/string_utils';
import clsx from 'clsx';
import './styles/style.css'
import ShowMore from './ShowMore';

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
        this._isMounted = false
        this.worker = new DashbordWorker()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    fetchResources = async (item) => {
        this.updateState({ resources: await fetchSpecificResources(this, item) })
    }

    onMore = (showMore) => {
        this.updateState({ showMore })
        if (showMore) {
            this.fetchResources(showMore)
        }
    }

    onSequenceChange = async (sequence) => {
        let response = await processWorker(this, this.worker, {
            rawList: this.state.rawList,
            sequence
        })
        if (response?.status === 200) {
            this.updateState({ dataset: response.data, toggle: !this.state.toggle })
        }

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
                            <Total label='Cloudlet' data={total[localFields.cloudletName]} />
                            <Total label='Cluster Instances' data={total[localFields.clusterName]} />
                            <Total label='App Instances' data={total[localFields.appName]} />
                        </div> : null}
                    </div>
                    {showMore ? <ShowMore data={showMore} resources={resources}/> : null}
                    {children}
                </div>
            </div>
        )
    }

    fetchInitData = async () => {
        let response = await fetchShowData(this, this.worker)
        if (response?.status === 200) {
            const { data: dataset, total, dataList: rawList } = response
            this.updateState({ dataset, total, rawList })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchInitData()
    }
    
    componentWillUnmount(){
        this._isMounted = false
    }
}

export default withStyles(controlStyles)(Control)