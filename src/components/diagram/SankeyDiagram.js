import React from 'react';
import SankeyDiagram from '../../charts/plotly/SankeyDiagram'


export default class SankeyDiagram extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        SankeyDiagramComp('diaContainer')
    }

    render() {
        return (
            <div id={'diaContainer'}>diagram</div>
        )
    }
}
