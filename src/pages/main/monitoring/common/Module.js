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