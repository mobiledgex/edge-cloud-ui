import React from 'react';
import Plot from 'react-plotly.js';

class Simple extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 600,
            vHeight: 300
        }
    }
    
    render() {
        const { width, height } = this.props.size;
        //console.log('size me == ', width, height)
        return (

            <Plot
                data={[
                    {
                        x: [1, 2, 3],
                        y: [2, 6, 3],
                        type: 'scatter',
                        mode: 'lines+points',
                        marker: {color: 'red'},
                    },
                    {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
                ]}
                layout={{width:width, height:height, title: 'A Fancy Plot'}}
            />

        );
    }
}
export default Simple;