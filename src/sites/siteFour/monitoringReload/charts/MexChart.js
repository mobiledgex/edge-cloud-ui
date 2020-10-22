import { Card, Grid } from '@material-ui/core'
import React from 'react'
import { fields } from '../../../../services/model/format'
import LineChart from './linechart/MexLineChart'

class MexChart extends React.Component {
    constructor(props) {
        super()
    }

    validateRegionFilter = (region) => {
        let regionFilter = this.props.filter[fields.region]
        return regionFilter.includes(region)
    }

    render() {
        const {chartData, avgData, filter} = this.props
        let xs = filter.region.length > 1
        return (
            <div>
                <Grid container spacing={1}>
                    {chartData && Object.keys(chartData).map(region => {
                        if (this.validateRegionFilter(region)) {
                            let chartDataRegion = chartData[region]
                            let avgDataRegion = avgData[region] ? avgData[region] : {}
                            return (
                                        Object.keys(chartDataRegion).map(key => {
                                            return filter.metricType.includes(chartDataRegion[key].metric.field) ?
                                                <Grid key={key} item xs={4} sm={4} md={6} lg={4} xl={3}>
                                                    <Card style={{ padding: 10, height: '100%' }}>
                                                        <LineChart id={key} data={chartDataRegion[key]} avgDataRegion={avgDataRegion} globalFilter={filter} tags={[2, 3]} tagFormats={['', '[']} />
                                                    </Card>
                                                </Grid> : null
                                        })
                            )
                        }
                    })}
                </Grid>
            </div>
        )
    }
}

export default MexChart