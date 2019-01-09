import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react'
import NetworkInoutLegend from './network/networkInoutLegend';
import BBLineChart from '../charts/bbLineChart';
import sizeMe from 'react-sizeme'

class DailyReportView extends React.Component {
    constructor() {
        super();
        this.state = {
            optionOne : [ { key: 'ba', value: 'ba', flag: 'ba', text: 'CPU Usage' } ]
        }
    }
    render() {
        const { width, height } = this.props.size
        console.log('chart size == ', width, height)
        return (
            <Grid divided='vertically'>
                <Grid.Row columns={4} className='panel_filter_inline'>
                    <Grid.Column>
                        <Dropdown placeholder='CPU Usage' fluid search selection options={this.state.optionOne} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} className='panel_contents'>
                    <Grid.Column width={12}>
                        <BBLineChart w={width*(12/16)} h={height*0.7}/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']}></NetworkInoutLegend>
                        <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']}></NetworkInoutLegend>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
export default sizeMe({ monitorHeight: true })(DailyReportView)
