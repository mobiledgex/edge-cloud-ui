import React from 'react'
import MonitoringComponent from '../../components/monitoringComponent'


class PerformanceOfApp extends React.Component {
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
export default MonitoringComponent({width:600, height:400})(PerformanceOfApp)
