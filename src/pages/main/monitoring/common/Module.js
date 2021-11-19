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

    handleLegendStateChange = (resources) => {
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
        }, ()=>{
            this.props.handleDataStateChange(this.state.legends)
        })
    }

    render() {
        const { legends } = this.state
        return (
            legends ?  <React.Fragment>
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
            this.props.handleDataStateChange(legends)
            this.setState({ legends })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchLegends()
    }
}

const mapStateToProps = (state) => {
    return {
        privateAccess: state.privateAccess.data,
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region
    }
};



export default withRouter(connect(mapStateToProps, null)(Module));