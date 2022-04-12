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
import { withRouter } from 'react-router-dom'
import Resources from './resource/Resources'
import { fetchShowData } from '../services/service'
import isEmpty from 'lodash/isEmpty'

class Module extends React.Component {
    constructor(props) {
        super(props)
        //filter resources based on legendList
        this.legendList = {}
        this._isMounted = false
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    handleLegendStateChange = (resources) => {
        if (this._isMounted && !isEmpty(resources)) {
            let legendWithResources = {}
            const { legends, region } = this.props
            Object.keys(legends).map(legendKey => {
                let data = { ...legends[legendKey] }
                if (resources && resources[legendKey]) {
                    let resourcesKeys = Object.keys(resources[legendKey])
                    resourcesKeys && resourcesKeys.map(resourceKey => {
                        data[resourceKey] = data[resourceKey] ? data[resourceKey] : {}
                        data[resourceKey] = { ...data[resourceKey], ...resources[legendKey][resourceKey] }
                    })
                }
                legendWithResources[legendKey] = data
            })
            this.props.handleDataStateChange(region, legendWithResources)
        }
    }

    render() {
        return (
            <React.Fragment>
                <Resources {...this.props} handleLegendStateChange={this.handleLegendStateChange} />
            </React.Fragment>
        )
    }


    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};



export default withRouter(connect(mapStateToProps, null)(Module));