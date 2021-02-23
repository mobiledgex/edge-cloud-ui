import React from 'react'
import { withRouter } from 'react-router-dom'
import MexChart from '../charts/MexChart'
import { metricType } from '../helper/Constant'


class MexMetric extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { avgData, filter, rowSelected, style, range, org, updateAvgData } = this.props
        let parent = filter.parent
        return (
            <React.Fragment>
                {filter.region.map(region => {
                    return (
                        metricType(parent.id).map(metric => (
                            <MexChart key={`${region}-${metric.field}`} region={region} metric={metric} avgData={avgData} filter={filter} rowSelected={rowSelected} style={style} range={range} org={org} updateAvgData={updateAvgData} />
                        ))
                    )
                })}
            </React.Fragment>
        )
    }
}

export default withRouter(MexMetric);