import React from 'react'
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import SequenceFunnel from '../../../../hoc/charts/d3/sequence/SequenceFunnel';
import { localFields } from '../../../../services/fields';
import { withStyles } from '@material-ui/styles';
import { controlStyles } from './styles/control-styling'
import { uniqueId } from '../../../../helper/constant/shared';
import { sequence as _sequence } from './services/sequence';
import { processWorker } from '../../../../services/worker/interceptor';
import DashbordWorker from './services/dashboard.worker.js';
import Total from './total/Total';
import { fetchShowData, fetchSpecificResources } from './services/service';
import clsx from 'clsx';
import './styles/style.css'
import ShowMore from './ShowMore';
import { CircularProgress } from '@material-ui/core';
import { Icon, IconButton } from '../../../../hoc/mexui';
import { connect } from 'react-redux';
import LinearProgress from '../../../../hoc/loader/LinearProgress';

class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sequence: _sequence,
            chartData: undefined,
            rawList: undefined,
            total: undefined,
            dataset: undefined,
            toggle: false,
            showMore: undefined,
            resources: undefined,
            loading: false,
            loadingResources: false
        }
        this._isMounted = false
        this.regions = props.regions
        this.worker = new DashbordWorker()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    fetchResources = async (item) => {
        this.updateState({ loadingResources: true })
        this.updateState({ resources: await fetchSpecificResources(this, item) })
        this.updateState({ loadingResources: false })
    }

    onMore = (showMore) => {
        this.updateState({ showMore, resources: undefined})
        if (showMore) {
            this.fetchResources(showMore)
        }
    }

    onUpdateSequence = (data) => {
        let sequence = [...this.state.sequence]
        sequence = sequence.map((item, i) => {
            item.active = i === data.y0 || i === data.y1
            return item
        })
        this.setState({ sequence })
    }

    onSequenceChange = async (sequence) => {
        sequence.forEach((item, i) => {
            item.active = i < 2
        })
        let response = await processWorker(this, this.worker, {
            rawList: this.state.rawList,
            sequence
        })
        if (response?.status === 200) {
            this.updateState({ dataset: response.data, toggle: !this.state.toggle })
        }
    }

    onRefreshSunburst = ()=>{
        this.fetchInitData()
    }

    render() {
        const { sequence, toggle, showMore, dataset, total, resources, loading, loadingResources } = this.state
        const { children } = this.props
        return (
            <div className='control'>
                <div className={clsx('col-left', 'mex-card')}>
                    {(Boolean(dataset) && loading) ? <LinearProgress /> : null}
                    <div className='toolbar'>
                        <IconButton disabled={loading} onClick={this.onRefreshSunburst}><Icon>refresh</Icon></IconButton>
                    </div>
                    {dataset ? <div className='sunburstMain'>
                        <div className='sunburst'>
                            <Sunburst dataset={dataset} toggle={toggle} onClick={this.onMore} onUpdateSequence={this.onUpdateSequence} />
                        </div>
                    </div> :
                        <div className='sunburstLoader'>
                            <CircularProgress size={400} thickness={0.3} className='sunburstLoader1' />
                            <CircularProgress size={600} thickness={0.2} />
                        </div>}
                </div>
                <div className='col-right'>
                    <div className='content1'>
                        <div className='mex-card'>
                            <SequenceFunnel sequence={sequence} onChange={this.onSequenceChange} key={uniqueId()}></SequenceFunnel>
                        </div>
                        <Total data={total} />
                    </div>
                    {showMore ? <ShowMore data={showMore} resources={resources} loading={loadingResources} /> : null}
                    {children}
                </div>
            </div>
        )
    }

    fetchInitData = async () => {
        const { sequence } = this.state
        this.updateState({ loading: true })
        let response = await fetchShowData(this, this.worker, sequence, this.regions)
        this.updateState({ loading: false, dataset: undefined })
        if (response?.status === 200) {
            const { data: dataset, total, dataList: rawList } = response
            this.updateState({ dataset, total, rawList })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchInitData()
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        regions: state.regionInfo.region
    }
};

export default connect(mapStateToProps, null)(withStyles(controlStyles)(Control));