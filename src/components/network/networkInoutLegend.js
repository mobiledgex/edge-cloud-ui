import React from 'react';

export default class NetworkInOutLegend extends React.Component {
    constructor() {
        super();
        this.state = {
            value:0.00
        }
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.value){
            //console.log('avg data = ', nextProps.chartId, nextProps.value)
            this.setState({value:nextProps.value})
        }
    }

    render() {
        let {title, value, unit} = this.props;
        return (
            <div className='chart_category'>
                <div className='value'>{this.state.value}</div>
                <div className='unit'>{unit}</div>
                <div className='line' style={{backgroundColor:this.props.colors[0]}}></div>
                <div className='label'>{title}</div>
            </div>
        )
    }
}

NetworkInOutLegend.defaultProps = {
    title:'NO TITLE',
    value:1234
}
NetworkInOutLegend.defaultProps = {
    colors:["#ffffff","#eeeeee"]
}
