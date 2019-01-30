import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react'
import NetworkInoutLegend from './network/networkInoutLegend';
import BBLineChart from '../charts/bbLineChart';
import HistoricalColumn from '../charts/plotly/historicalColumn';
import sizeMe from 'react-sizeme'

class DailyReportView extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        const { width, height } = this.props.size
        console.log('chart size == ', width, height)
        return (
            <div style={{width:width, height:height}}>
                <HistoricalColumn/>
            </div>
        )
    }
}
export default sizeMe({ monitorHeight: true })(DailyReportView)
