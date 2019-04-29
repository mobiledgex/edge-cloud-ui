import React, { Component } from 'react';
import { Grid, List, Label, Table, Icon, Card } from 'semantic-ui-react';
import Gauge from '../chartGauge/gauge';


class EnvironmentStatus extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        }
        //임계치 설정에 따라 컬러값 변경 필요
        this.sectionsProps_temp = [
            { fill: '#4ef43d', stroke: '#4ef43d' },
            { fill: '#4ef43d', stroke: '#4ef43d' },
            { fill: '#4ef43d', stroke: '#4ef43d' },
            { fill: '#fad91d', stroke: '#fad91d' },
            { fill: '#db970b', stroke: '#db970b' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' }
        ];

        this.legend_temp = ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
        this.sectionsProps_humi = [
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#F46806', stroke: '#F46806' },
            { fill: '#db970b', stroke: '#db970b' },
            { fill: '#fad91d', stroke: '#fad91d' },
            { fill: '#4ef43d', stroke: '#4ef43d' },
            { fill: '#28dba1', stroke: '#28dba1' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#21d0fa', stroke: '#21d0fa' },
            { fill: '#4ef43d', stroke: '#4ef43d' },
            { fill: '#fad91d', stroke: '#fad91d' },
            { fill: '#fad91d', stroke: '#fad91d' },
            { fill: '#F46806', stroke: '#F46806' },
            { fill: '#F46806', stroke: '#F46806' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' },
            { fill: '#DB312D', stroke: '#DB312D' }
        ];

        this.legend_humi = ['', '10', '', '20', '', '30', '', '40', '', '50',
            '', '60', '', '70', '', '80', '', '90', '', '%'];
    }


    chartComponent = (props, office, title) => (
        <Card raised>
            <Card.Content>
                <Card.Header>
                    {title ? title : 'NO TITLE'}
                </Card.Header>
            </Card.Content>
            <Card.Content className='gaugeBorder'>
                <Gauge data={props ? props[office[0]].temp : null} type={'temp'} label={'온도'} unit={'℃'}
                       limits={props ? {minor:props[office[0]].temp.minor1, major:props[office[0]].temp.major1, critical: props[office[0]].temp.critical1}: {}}
                       sections={this.sectionsProps_temp} legend={this.legend_temp}
                />

                <Gauge data={props ? props[office[0]].humi : null} type={'humi'} label={'습도'} unit={'%'}
                       limits={props ? {minor:props[office[0]].temp.minor2, major:props[office[0]].temp.major2, critical: props[office[0]].temp.critical2}: {}}
                       sections={this.sectionsProps_humi} legend={this.legend_humi}
                />
                {/*<div style={{position:'absolute', left:10, top:185, backgroundColor:'transparent'}}>
                    <List className='legendDial'>
                        <List.Item>MIN {props ? props[office[0]].temp.minor1:null}</List.Item>
                        <List.Item>MAJ {props ? props[office[0]].temp.major1:null}</List.Item>
                        <List.Item>CRI {props ? props[office[0]].temp.critical1:null}</List.Item>
                    </List>
                </div>

                <div style={{position:'absolute', left:10, top:365, backgroundColor:'transparent'}}>
                    <List className='legendDial'>
                        <List.Item>MIN {props ? props[office[0]].humi.minor1:null}</List.Item>
                        <List.Item>MAJ {props ? props[office[0]].humi.major1:null}</List.Item>
                        <List.Item>CRI {props ? props[office[0]].humi.critical1:null}</List.Item>
                    </List>
                </div>
                <div style={{position:'absolute', left:160, top:365, backgroundColor:'transparent'}}>
                    <List className='legendDial'>
                        <List.Item>MIN {props ? props[office[0]].humi.minor2:null}</List.Item>
                        <List.Item>MAJ {props ? props[office[0]].humi.major2:null}</List.Item>
                        <List.Item>CRI {props ? props[office[0]].humi.critical2:null}</List.Item>
                    </List>
                </div>*/}

            </Card.Content>

        </Card>
    )
    getOfficeName = (data, i) => {
        if(data && data.rows[i]) {
            let key = Object.keys(data.rows[i])[0];
            return data.headers[key];
        } else {
            return null;
        }

    }
    getOffice = (data, i) => (
        (data && data.rows[i]) ? Object.keys(data.rows[i]) : null
    )
    getHasData = (data, i) => {
        if(data) {
            if(data.rows[i]){
                return data.rows[i];
            } else {
                return data.rows[i] = null;
            }

        } else {
            return null;
        }

    }
    componentWillReceiveProps(nextProps) {
        let self = this;
        setTimeout(function(){self.setState({data: nextProps.data})}, 1500)
    }
    render() {

        return (
            <Grid columns='equal' style={{paddingRight:15}}>
                <Grid.Row style={{paddingTop:0}} stretched>
                    <Grid.Column style={{padding:0}}>
                        {this.chartComponent(this.getHasData(this.state.data, 0), this.getOffice(this.state.data, 0) ,this.getOfficeName(this.state.data, 0))}
                    </Grid.Column>
                    <Grid.Column style={{padding:0}}>
                        {this.chartComponent(this.getHasData(this.state.data, 1), this.getOffice(this.state.data, 1) ,this.getOfficeName(this.state.data, 1))}
                    </Grid.Column>
                    <Grid.Column style={{padding:0}}>
                        {this.chartComponent(this.getHasData(this.state.data, 2), this.getOffice(this.state.data, 2) ,this.getOfficeName(this.state.data, 2))}
                    </Grid.Column>
                    <Grid.Column style={{padding:0}}>
                        {this.chartComponent(this.getHasData(this.state.data, 3), this.getOffice(this.state.data, 3) ,this.getOfficeName(this.state.data, 3))}
                    </Grid.Column>
                    <Grid.Column style={{padding:0}}>
                        {this.chartComponent(this.getHasData(this.state.data, 4), this.getOffice(this.state.data, 4) ,this.getOfficeName(this.state.data, 4))}
                    </Grid.Column>
                    <Grid.Column style={{padding:0}}>
                        {this.chartComponent(this.getHasData(this.state.data, 5), this.getOffice(this.state.data, 5) ,this.getOfficeName(this.state.data, 5))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default EnvironmentStatus;