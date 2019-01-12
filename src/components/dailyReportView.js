import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react'
import NetworkInoutLegend from './network/networkInoutLegend';
import BBLineChart from '../charts/bbLineChart';
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
            <Grid divided='vertically' className='panel_contents'>
                <Grid.Row columns={2} className='panel_charts'>
                    <Grid.Column width={12}>
                        <BBLineChart w={width*(12/16)} h={height*0.8}/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']} title="CPU(Average)" value="54" unit="sec"></NetworkInoutLegend>
                        <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']} title="Network(Total)" value="200,037" unit=""></NetworkInoutLegend>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
export default sizeMe({ monitorHeight: true })(DailyReportView)
