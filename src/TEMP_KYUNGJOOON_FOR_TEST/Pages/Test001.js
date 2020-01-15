import React from 'react';
import GridLayout from "../../components/react-grid-layout_kj/ReactGridLayout";
import './Test001.css'
import './Test001_2.css'

export default class Test001 extends React.Component {
    render() {
        // layout is an array of objects, see the demo for more complete usage
        const layout = [
            {i: 'a', x: 0, y: 0, w: 0.5, h: 1,},
            {i: 'b', x: 1, y: 0, w: 1.5, h: 1},
            {i: 'c', x: 0, y: 1, w: 0.5, h: 1},
            {i: 'd', x: 1, y: 1, w: 1.5, h: 1},

        ];
        return (
            <div>
                <div style={{fontSize: 50}}>sdlkflsdkflksdlfksdlfklsd</div>
                <div style={{fontSize: 50}}>sdlkflsdkflksdlfksdlfklsd</div>
                <div style={{fontSize: 50}}>sdlkflsdkflksdlfksdlfklsd</div>

                <div style={{}}>
                    <GridLayout className="layout" layout={layout} cols={2} maxRows={2} rowHeight={300} width={1600}
                                verticalCompact={true}
                                style={{height: 600}}

                                onDragStop={(i: string, x: number, y: number) => {
                                    console.log('sldkflskdflksdlfklsdkfk====>', i);
                                }}
                    >
                        <div key="a"
                             style={{color: 'black', fontSize: 25, display: 'flex', alignItem: 'center', alignSelf: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                            <div>
                                고경준 천재님이십닏sldkflsdkflksdlfk
                            </div>
                            <div>
                                고경준 천재님이십닏sldkflsdkflksdlfk
                            </div>
                            <div>
                                고경준 천재님이십닏sldkflsdkflksdlfk
                            </div>

                        </div>
                        <div key="b" style={{color: 'black'}}>111111</div>
                        <div key="c" style={{color: 'black'}}>222222</div>
                        <div key="d" style={{color: 'black'}}>333333</div>
                    </GridLayout>
                </div>
            </div>
        )
    }
}
