import React from 'react'
import MonitoringComponent from '../../components/monitoringComponent'


class PerformanceOfAppTable extends React.Component {
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
export default MonitoringComponent({width:'100%', height:400})(PerformanceOfAppTable)