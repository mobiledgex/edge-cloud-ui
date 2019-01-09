import React from 'react';

export default class NetworkInOutLegend extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            
        }
    }
    render() {
        return (
            <div className='chart_category'>
                <div className='value'>448.64</div>
                <div className='unit'>MB</div>
                <div className='line' style={{backgroundColor:this.props.colors[0]}}></div>
                <div className='label'>Network in</div>
            </div>
        )
    }
}

NetworkInOutLegend.defaultProps = {
    colors:["#ffffff","#eeeeee"]
}