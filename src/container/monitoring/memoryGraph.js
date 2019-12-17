import React from 'react'
import MonitoringComponent from '../../components/monitoringComponent'


class MemoryGraph extends React.Component {
    constructor() {
        super();

    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }

    render() {

        return (

            <div>{this.props.title}</div>

        )
    }
}
export default MonitoringComponent({width:null, height:220})(MemoryGraph)
