/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import clsx from 'clsx';
import Sunburst from '../../../../hoc/charts/d3/sunburst/Sunburst';
import SequenceFunnel from '../../../../hoc/charts/d3/sequence/SequenceFunnel';
import { withStyles } from '@material-ui/styles';
import { controlStyles } from './styles/control-styling'
import { uniqueId } from '../../../../helper/constant/shared';
import { sequence as _sequence } from './services/sequence';
import { processWorker } from '../../../../services/worker/interceptor';
import DashbordWorker from './services/dashboard.worker.js';
import Total from './total/Total';
import { fetchShowData, fetchSpecificResources } from './services/service';
import ShowMore from './ShowMore';
import { CircularProgress } from '@material-ui/core';
import { Icon, IconButton } from '../../../../hoc/mexui';
import { connect } from 'react-redux';
import LinearProgress from '../../../../hoc/loader/LinearProgress';
import './styles/style.css'

class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sequence: _sequence(),
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
        this.updateState({ showMore, resources: undefined })
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

    resetSequence = (sequence) => {
        sequence.forEach((item, i) => {
            item.active = i < 2
        })
    }

    onSequenceChange = async (sequence) => {
        this.resetSequence(sequence)
        let response = await processWorker(this, this.worker, {
            rawList: this.state.rawList,
            sequence
        })
        if (response?.status === 200) {
            this.updateState({ dataset: response.data, toggle: !this.state.toggle })
        }
    }

    onRefreshSunburst = () => {
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
                        <Total data={total} loading={loading} />
                    </div>
                    {showMore ? <ShowMore data={showMore} resources={resources} loading={loadingResources} /> : null}
                    {children}
                </div>
            </div>
        )
    }

    fetchInitData = async () => {
        let sequence = [...this.state.sequence]
        this.updateState({ loading: true })
        let response = await fetchShowData(this, this.worker, sequence, this.regions)
        this.updateState({ loading: false, dataset: undefined, showMore: undefined, resources: undefined })
        if (response?.status === 200) {
            this.resetSequence(sequence)
            const { data: dataset, total, dataList: rawList } = response
            this.updateState({ dataset, total, rawList, sequence })
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
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region
    }
};

export default connect(mapStateToProps, null)(withStyles(controlStyles)(Control));