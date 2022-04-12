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
import { connect } from 'react-redux'
import { PARENT_APP_INST, PARENT_CLOUDLET, PARENT_CLUSTER_INST } from '../../../helper/constant/perpetual'
import { NoData } from '../../../helper/formatter/ui'
import AppMonitoring from './modules/app/AppMonitoring'
import CloudletMonitoring from './modules/cloudlet/CloudletMonitoring'
import ClusterMonitoring from './modules/cluster/ClusterMonitoring'
import { fetchShowData } from './services/service'

class Show extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            legends: undefined,
            selection: { count: 0 },
            refresh: false,
            loading: true,
        }
        this._isMounted = false
        this.legendList = {}
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    handleSelectionStateChange = (selection) => {
        this.updateState({ selection })
    }

    handleDataStateChange = (region, legends) => {
        this.setState(prevState => {
            let prelegends = { ...prevState.legends }
            prelegends[region] = legends
            return { legends: prelegends }
        })
    }

    render() {
        const { loading, legends, selection, refresh } = this.state
        const { tools } = this.props
        return (
            legends ? <React.Fragment>
                {
                    tools.moduleId === PARENT_CLOUDLET ? <CloudletMonitoring tools={tools} loading={loading} legends={legends} metricRequestData={this.legendList} selection={selection} refresh={refresh} handleDataStateChange={this.handleDataStateChange} handleSelectionStateChange={this.handleSelectionStateChange} /> :
                        tools.moduleId === PARENT_CLUSTER_INST ? <ClusterMonitoring tools={tools} loading={loading} legends={legends} metricRequestData={this.legendList} selection={selection} refresh={refresh} handleDataStateChange={this.handleDataStateChange} handleSelectionStateChange={this.handleSelectionStateChange} /> :
                            tools.moduleId === PARENT_APP_INST ? <AppMonitoring tools={tools} loading={loading} legends={legends} metricRequestData={this.legendList} selection={selection} refresh={refresh} handleDataStateChange={this.handleDataStateChange} handleSelectionStateChange={this.handleSelectionStateChange} /> : null
                }
            </React.Fragment> : <NoData loading={loading}/>
        )
    }

    generateRequestData = async (region, tools, count) => {
        const { moduleId, organization } = tools
        let data = await fetchShowData(this, moduleId, { region, organization })
        this.count = this.count + 1
        if (data) {
            const { legends, legendList } = data
            if (this._isMounted) {
                this.setState(prevState => {
                    let prelegends = prevState.legends
                    let loading = legendList.length > 0 ? false : prevState.loading
                    prelegends = prelegends ? prelegends : {}
                    prelegends[region] = legends
                    this.legendList[region] = legendList
                    return { legends: prelegends, loading }
                })
            }
        }
        if (this.count === count) {
            this.setState({ loading: false })
        }
    }

    shouldComponentUpdate(nextPros, nextState) {
        return !nextState.loading
    }

    fetchLegends = async () => {
        const { tools, regions } = this.props
        this.count = 0
        let length = regions.length
        regions.forEach(region => {
            this.generateRequestData(region, tools, length)
        })
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchLegends()
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


export default connect(mapStateToProps, null)(Show);