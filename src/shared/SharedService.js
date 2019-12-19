import React from 'react';
import {
    Button,
    Container,
    Dropdown,
    Grid,
    Header,
    Icon,
    Image,
    Input,
    Item,
    Label,
    Menu,
    Modal,
    Popup,
    Segment
} from 'semantic-ui-react';
//import 'semantic-ui-css/semantic.min.css'
import '../css/introjs.css';
import '../css/introjs-dark.css';
import '../css/index.css';
export const  renderMonitoringHeader = (title: string) => {

    const options = [
        {key: 1, text: 'Choice 1', value: 1},
        {key: 2, text: 'Choice 2', value: 2},
        {key: 3, text: 'Choice 3', value: 3},
    ]

    return (


        <Grid.Row className='content_title'
                  style={{width: 'fit-content', display: 'inline-block', marginTop: -12, marinLeft: -90}}>
            <Grid.Column className='title_align'
                         style={{lineHeight: '36px', fontSize: 31}}>Monitoring</Grid.Column>

            <Grid.Column className='title_align'>

            </Grid.Column>

            <div style={{marginLeft: '10px'}}>
                <button className="ui circular icon button" onClick={() => {
                    alert('dslfksdlfk')
                }}><i aria-hidden="true" className="info icon"></i>
                </button>
            </div>
            <Menu compact style={{marginLeft: 10,}}>
                <div className='filter'>
                    <Dropdown text='Dropdown' options={options} simple item/>
                </div>
            </Menu>
        </Grid.Row>


    )
}



