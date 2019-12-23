import React from 'react';
import Plot from 'react-plotly.js';


/*
US
Public
-
-
US
Test123
-
-
US
cloudletPool_bictest_1223-01
-
-
EU
TEST1223
-
-
EU
Public
-
-
EU
bicCloudletPool20191220-1
 */
const _data = {
    type: "sankey",
    orientation: "h",
    node: {
        pad: 15,
        thickness: 30,
        line: {
            color: "black",
            width: 0.5
        },
        font:{
            size:12,
            color:"black"
        },
        label: ["US:Public", "US:Test123",  "US: cloudletPool_bictest_1223-01", "EU:TEST1223", "EU:Public", "EU:bicCloudletPool20191220-1",
                "org1574180880", "WonhoOrg1", "ArtStage", "adevorg", "MobiledgeX", "Demo-Rah"
        ],
        color: ["blue", "blue","blue", "blue","blue", "blue",
                "green", "green","green", "green","green", "green"]
    },

    link: {
        source: [0,1,2,3,4,5],
        target: [8,6,8,11,6,8],
        value:  [1,1,1,1,1,1]
    }
}

//
class SankeyDiagram extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 600,
            vHeight: 300
        }

    }
    componentWillReceiveProps(nextProps) {
        console.log('update props... simple    -', JSON.stringify(nextProps.size))
            //this.setState({vWidth:nextProps.size.width, vHeight:nextProps.size.height})
    }
    render() {
        const { width, height } = this.props.size;
        //console.log('size me == ', width, height)
        return (

            <Plot
                data={[_data]}
                layout={
                    {
                        width:width,
                        height:height,
                        font: {
                            size: 10,
                            color: 'white'
                        },
                        plot_bgcolor: '#acacac',
                        paper_bgcolor: '#acacac',
                        title: 'Linked the Organization with the Cloudlet Pool'
                    }
                }
            />

        );
    }
}
export default SankeyDiagram;
