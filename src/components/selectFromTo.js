import React from 'react';

import Picker from '../components/calendar/picker';

import {Dropdown, Grid} from 'semantic-ui-react';


export default class SelectFromTo extends React.PureComponent {
    state = {
        startValue: null,
        endValue: null,
        startOpen: false,
        endOpen: false,
    };
    constructor() {
        super();
        this.state = {
            optionOne : [ { key: 'ba', value: 'ba', text: 'Last Hour' } ]
        }
    }


    render() {
        const state = this.state;
        return (
            <Grid>

                {/*<Grid.Row columns={4}>*/}
                    {/*<Grid.Column width={1}><div>From</div></Grid.Column>*/}
                    {/*<Grid.Column>*/}
                        {/*<div><Picker></Picker></div>*/}
                    {/*</Grid.Column>*/}
                    {/*<Grid.Column width={1}><div>To</div></Grid.Column>*/}

                <Grid.Row columns={2} className='panel_title_filter'>
                    <Grid.Column><div>Showing data for</div></Grid.Column>
                    <Grid.Column>
                        <Dropdown placeholder='Last Hour' fluid search selection options={this.state.optionOne} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}