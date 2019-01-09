import React from 'react';

export default class NetworkInOutLegend extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            
        }
    }
    render() {
        let {title, value, unit} = this.props;
        return (
            <div className='chart_category'>
                <div className='value'>{value}</div>
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