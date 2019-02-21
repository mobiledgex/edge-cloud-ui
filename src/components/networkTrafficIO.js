import React from 'react';
import ProgressBarGradient from '../charts/progressBarGradient';
import { Grid } from 'semantic-ui-react';
import './networkTrafficIO.css';

let leftStyle = {
    display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'flex-start'
}
let rightStyle = {
    display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'flex-end'
}

class NetworkTrafficIO extends React.Component {
    makeRowRevers = (obj, max) => (
        <Grid.Row className="progressContent" columns={2}>
            <Grid.Column width={4} style={rightStyle}>
                <div className="traffic_value">{obj}</div><div className="traffic_unit">MB</div>
            </Grid.Column>
            <Grid.Column width={12}>
                <ProgressBarGradient chartId={this.props.cId+'prgChart'+this.props.gId} direction="reverse" data={obj} max={max}/>
            </Grid.Column>
        </Grid.Row>
    )
    makeRow = (obj, max) => (
        <Grid.Row className="progressContent" columns={2}>
            <Grid.Column width={12}>
                <ProgressBarGradient chartId={this.props.cId+'prgChart'+this.props.gId} direction="normal" data={obj} max={max}/>
            </Grid.Column>
            <Grid.Column width={4} style={leftStyle}>
                <div className="traffic_value">{obj}</div><div className="traffic_unit">MB</div>
            </Grid.Column>
        </Grid.Row>
    )
    componentWillReceiveProps(nextProps, nextContext) {

    }

    componentDidMount() {
        console.log(this.props.direction,'    max -'+this.props.maxData, ' data-'+this.props.data)
    }
    render() {
        return (
            <Grid>
                {(this.props.direction === 'normal')?this.makeRow(this.props.data, this.props.maxData):this.makeRowRevers(this.props.data, this.props.maxData)}
            </Grid>
        )
    }
}
NetworkTrafficIO.defaultProps = {
    cId : 'cId_'+Math.random()*10000000,
    direction:'normal',
    data:{in:1, out:1}
}
export default NetworkTrafficIO;
