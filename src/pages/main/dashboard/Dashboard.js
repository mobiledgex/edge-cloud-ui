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
import { EVENT } from '../../../helper/constant/perpetual'
import { uniqueId } from '../../../helper/constant/shared'
import { localFields } from '../../../services/fields'
import Logs from './auditLog/Logs'
import Control from './control/Control'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            renderKey: uniqueId()
        }
    }

    render() {
        const { renderKey } = this.state
        return (
            <div className='dashboard' key={renderKey}>
                <Control>
                    <Logs type={EVENT} />
                </Control>
            </div>
        )
    }

    componentDidUpdate(preProps, preState) {
        const { organizationInfo } = this.props
        if (preProps.organizationInfo[localFields.organizationName] !== organizationInfo[localFields.organizationName]) {
            this.setState({ renderKey: uniqueId() })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default connect(mapStateToProps, null)(Dashboard);