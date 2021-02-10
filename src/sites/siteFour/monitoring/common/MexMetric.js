import React from 'react'
import { withRouter } from 'react-router-dom'
import MexChart from '../charts/MexChart'


class MexMetric extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { avgData, filter, rowSelected, style, range, org, updateAvgData } = this.props
        let parent = filter.parent
        return (
            <React.Fragment>
                {filter.region.map(region => (
                    parent.metricTypeKeys.map(metric => (
                        <MexChart key={`${region}-${metric.field}`} region={region} metric={metric} avgData={avgData} filter={filter} rowSelected={rowSelected} style={style} range={range} org={org} updateAvgData={updateAvgData} />
                    ))
                ))}
            </React.Fragment>
        )
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }
}

export default withRouter(MexMetric);