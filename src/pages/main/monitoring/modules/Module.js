import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Resources from '../common/Resources'
import { fetchShowData } from '../services/service'

class Module extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            legends: undefined
        }
        //filter resources based on legendList
        this.legendList = {}
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
            this.props.handleDataStateChange(this.props.region, this.state.legends)
        })
    }

    render() {
        const { legends } = this.state
        return (
            <React.Fragment>
                {legends ? <Resources {...this.props} legends={legends} legendList={this.legendList} handleLegendStateChange={this.handleLegendStateChange} /> : null}
            </React.Fragment>
        )
    }

    fetchLegends = async () => {
        const { region, moduleId } = this.props
        let data = await fetchShowData(this, moduleId, { region })
        if (data) {
            const { legends, legendList } = data
            this.legendList = legendList
            this.setState({ legends })
        }
    }

    componentDidMount() {
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