import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Resources from './resource/Resources'
import { fetchShowData } from '../services/service'

class Module extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            legends: undefined
        }
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
        if (this._isMounted) {
            this.setState(prevState => {
                let legends = prevState.legends
                Object.keys(legends).map(legendKey => {
                    if (resources && resources[legendKey]) {
                        let data = legends[legendKey]
                        let resourcesKeys = Object.keys(resources[legendKey])
                        resourcesKeys && resourcesKeys.map(resourceKey => {
                            data[resourceKey] = data[resourceKey] ? data[resourceKey] : {}
                            data[resourceKey] = { ...data[resourceKey], ...resources[legendKey][resourceKey] }
                        })
                    }
                })
                return { legends }
            }, () => {
                this.props.handleDataStateChange(this.state.legends)
            })
        }
    }

    render() {
        const { legends } = this.state
        return (
            legends ? <React.Fragment>
                <Resources {...this.props} legends={legends} legendList={this.legendList} handleLegendStateChange={this.handleLegendStateChange} />
            </React.Fragment> : null
        )
    }

    fetchLegends = async () => {
        const { region, moduleId, organization } = this.props
        let data = await fetchShowData(this, moduleId, { region, organization})
        if (data) {
            const { legends, legendList } = data
            this.legendList = legendList
            this.props.handleDataStateChange(legends, true)
            this.updateState({ legends })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchLegends()
    }

    componentWillUnmount()
    {
        this._isMounted = false  
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};



export default withRouter(connect(mapStateToProps, null)(Module));