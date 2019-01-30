import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react'
import NetworkInoutLegend from './network/networkInoutLegend';
import BBLineChart from '../charts/bbLineChart';
import sizeMe from 'react-sizeme'
import NetworkInOutSimple from "../container/developerSideInfo";

class NetworkIOView extends React.Component {
    constructor() {
        super();
        this.state = {
            optionOne : [
                { key: 'ca', value: 'ca', text: 'Cluster-A' },
                { key: 'cb', value: 'cb', text: 'Cluster-B' },
                { key: 'cc', value: 'cc', text: 'Cluster-C' },
                ],
            optionTwo : [
                { key: 'g1', value: 'g1', text: 'PokemonGo' },
                { key: 'g2', value: 'g2', text: 'Game2' },
                { key: 'g3', value: 'g3', text: 'Game3' }
                ],
            optionThree : [
                { key: 'd1', value: 'd1', text: 'CPU/MEM' },
                { key: 'd2', value: 'd2', text: 'NetworkIO' }
                ],
            optionFour : [
                { key: 't1', value: 't1', text: 'Last Hour' },
                { key: 't2', value: 't2', text: 'Last 3 Hours' },
                { key: 't3', value: 't3', text: 'Last 6 Hours' },
                { key: 't4', value: 't4', text: 'Last 12 Hours' },
                { key: 't5', value: 't5', text: 'Last 24 Hours' }
            ]
        }
    }
    makeSelectRange=()=> (
        <Grid.Row columns={4} className='panel_filter_inline'>
            <Grid.Column>
                <Dropdown placeholder='Cluster-A' fluid search selection options={this.state.optionOne} />
            </Grid.Column>
            <Grid.Column>
                <Dropdown placeholder='PokemonGo' fluid search selection options={this.state.optionTwo} />
            </Grid.Column>
            <Grid.Column>
                <Dropdown placeholder='CPU/MEM' fluid search selection options={this.state.optionThree} />
            </Grid.Column>
            <Grid.Column>
                <Dropdown placeholder='Last Hour' fluid search selection options={this.state.optionFour} />
            </Grid.Column>
        </Grid.Row>
    )
    render() {
        const { width, height } = this.props.size
        return (
            <Grid divided='vertically' className='panel_contents'>
                {this.makeSelectRange()}
                <Grid.Row columns={2} className='panel_charts'>
                    <Grid.Column width={12}>
                        <BBLineChart w={width*(12/16)} h={height*0.35}/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row>
                            <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']} title="CPU(Average)" value={13.03} unit="%"></NetworkInoutLegend>
                            <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']} title="MEMORY(Average)" value={24.04} unit="%"></NetworkInoutLegend>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
                <div className='panel_line_h'/>
                {this.makeSelectRange()}
                <Grid.Row columns={2} className='panel_charts'>
                    <Grid.Column width={12}>
                        <BBLineChart  w={width*(12/16)} h={height*0.35}/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row>
                            <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']} title="Network In" value={448.64} unit="MB"></NetworkInoutLegend>
                            <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']} title="Network Out" value={12.04} unit="MB"></NetworkInoutLegend>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
export default sizeMe({ monitorHeight: true })(NetworkIOView)