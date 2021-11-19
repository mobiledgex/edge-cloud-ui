import React from 'react'
import { resourceKeys } from '../../helper/constant'
import ResourceChart from './ResourceChart'

class Resources extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { moduleId } = this.props
        return resourceKeys(moduleId).map(resource => {
            return resource.serverRequest ? <ResourceChart key={resource.field} resource={resource} {...this.props} /> : null
        })
    }
}

export default Resources