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
import { Card, ImageListItem } from '@material-ui/core'
import LineChart from '../../charts/linechart/MexLineChart'
import { fetchResourceData, fetchFlavorBySelection } from '../../services/service'
import MetricWorker from '../../services/metric.worker.js'
import { equal } from '../../../../../helper/constant/operators'
import { localFields } from '../../../../../services/fields'

class ResourceChart extends React.Component {
    constructor(props) {
        super()
        this.state = {
            dataList: undefined
        }
        this.metricWorker = new MetricWorker();
        this.isFlavor = props.resource.field === localFields.flavorusage
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    metricKeyGenerator = (resourceType) => {
        return `${resourceType.serverField}${resourceType.subId ? `-${resourceType.subId}` : ''}`
    }

    render() {
        const { dataList } = this.state
        const { style, legends, range, search, selection, visibility } = this.props
        return (
            <React.Fragment>
                {dataList ? dataList.map((data, i) => {
                    let key = this.metricKeyGenerator(data.resourceType)
                    return (
                        visibility.includes(data.resourceType.field) ? <ImageListItem key={key} cols={1} style={style}>
                            <Card style={{ height: 300 }}>
                                <LineChart id={key} data={data} legends={legends} selection={selection} range={range} search={search} disableSelection={this.isFlavor} />
                            </Card>
                        </ImageListItem> : null
                    )
                }) : null}
            </React.Fragment>
        )
    }

    fetchResources = async () => {
        const { region, orgInfo, legends, metricRequestData, moduleId, resource, range, selection, handleLegendStateChange } = this.props
        let dataObject = await fetchResourceData(this, moduleId, { region, orgInfo, legends, metricRequestData, resourceKey: resource, range, selection, worker: this.metricWorker })
        if (dataObject) {
            const { resources, data } = dataObject
            if (this._isMounted) {
                this.updateState({ dataList: data })
                if (resources) {
                    handleLegendStateChange(resources)
                }
            }
        }
    }

    onSelection = async () => {
        const { dataList } = this.state
        const { region, selection } = this.props
        let data = await fetchFlavorBySelection(this, { worker: this.metricWorker, region, selection, dataList })
        if (data) {
            this.updateState({ dataList: [data] })
        }
    }

    componentDidUpdate(preProps, preState) {
        const { range, selection, resource } = this.props
        //fetch data on range change
        if (!equal(range, preProps.range)) {
            this.updateState({ dataList: undefined })
            this.fetchResources()
        }
        else if (selection && selection.count !== preProps.selection.count && this.isFlavor) {
            this.onSelection()
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchResources()
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        privateAccess: state.privateAccess.data,
    }
};

export default connect(mapStateToProps, null)(ResourceChart);