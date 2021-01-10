import React from 'react'
import { fields } from '../../../../services/model/format'
import LineChart from './linechart/MexLineChart'
class MexChart extends React.Component {
    constructor(props) {
        super()
    }
    render() {
        const { chartData, avgData, filter, rowSelected, style, range } = this.props
        return (
            <React.Fragment>
                {filter[fields.region].map(region => {
                    if (avgData[region]) {
                        let chartDataRegion = chartData[region]
                        let avgDataRegion = avgData[region] ? avgData[region] : {}
                        return (
                            Object.keys(chartDataRegion).map((key, i) => {
                                let metricTypeData = chartDataRegion[key]
                                return metricTypeData.values && filter.metricType.includes(metricTypeData.metric.field) ?
                                    <LineChart key={`${region}_${key}`} id={key} rowSelected={rowSelected} data={metricTypeData} avgDataRegion={avgDataRegion} globalFilter={filter} tags={[2, 3]} tagFormats={['', '[']} style={style} range={range} />
                                    :
                                    null
                            })
                        )
                    }
                })}
            </React.Fragment>
        )
    }
}

export default MexChart