import React from 'react';
import {Grid} from 'semantic-ui-react';
import SiteFourCreateFormDefault from './siteFourCreateFormDefault';
import BubbleGroup from '../charts/bubbleGroup';

export default class SiteFourCreateFlavorForm extends React.PureComponent {

    render() {
        return (
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column width={10}>
                        <SiteFourCreateFormDefault data={this.props.data} pId={0} onSubmit={() => console.log('submit form')}></SiteFourCreateFormDefault>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                            <BubbleGroup></BubbleGroup>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        )
    }
}
