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
            optionOne : [ { key: 'ba', value: 'ba', flag: 'ba', text: 'Cluster-A' } ],
            optionTwo : [ { key: 'do', value: 'do', flag: 'do', text: 'PockeMonGo' } ],
            optionThree : [ { key: 'do', value: 'do', flag: 'do', text: 'CPU/MEM' } ]
        }
    }
    makeSelectRange=()=> (
        <Grid.Row columns={4} className='panel_filter_inline'>
            <Grid.Column>
                <Dropdown placeholder='Cluster-A' fluid search selection options={this.state.optionOne} />
            </Grid.Column>
            <Grid.Column>
                <Dropdown placeholder='PockemonGo' fluid search selection options={this.state.optionTwo} />
            </Grid.Column>
            <Grid.Column>
                <Dropdown placeholder='CPU/MEM' fluid search selection options={this.state.optionThree} />
            </Grid.Column>
        </Grid.Row>
    )
    render() {
        const { width, height } = this.props.size
        return (
            <Grid divided='vertically'>
                {this.makeSelectRange()}
                <Grid.Row columns={2} className='panel_contents'>
                    <Grid.Column width={12}>
                        <BBLineChart w={width*(12/16)} h={height*0.35}/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row>
                            <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']}></NetworkInoutLegend>
                            <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']}></NetworkInoutLegend>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
                <div className='panel_line_h'/>
                {this.makeSelectRange()}
                <Grid.Row columns={2} className='panel_contents'>
                    <Grid.Column width={12}>
                        <BBLineChart  w={width*(12/16)} h={height*0.35}/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row>
                            <NetworkInoutLegend type="in" colors={['#22cccc','#22cccc']}></NetworkInoutLegend>
                            <NetworkInoutLegend type="out" colors={['#6699ff','#6699ff']}></NetworkInoutLegend>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
export default sizeMe({ monitorHeight: true })(NetworkIOView)