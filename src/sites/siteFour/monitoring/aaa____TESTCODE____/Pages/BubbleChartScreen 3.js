import * as React from 'react';
import BubbleChart from '@weknow/react-bubble-chart-d3';
import {notification} from "antd";
import '../../sites/PageMonitoring.css';

type Props = {};
type State = {};

export default class BubbleChartScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props)
    }

    componentDidMount(): void {
    }

    bubbleClick = (label) => {
        alert('sdlkfsldkflk')
    }
    legendClick = (label) => {
        notification.success({
            duration: 0.5,
            message: 'legendClick ',
        });
    }

    render() {
        return (
            <div>
                <BubbleChart
                    className={'bubbleChart'}
                    style={{backgroundColor: 'black'}}
                    graph={{
                        zoom: 0.4,
                        offsetX: 0.10,
                        offsetY: 0.05,
                    }}
                    width={500}
                    height={300}
                    padding={0} // optional value, number that set the padding between bubbles
                    showLegend={false} // optional value, pass false to disable the legend.
                    legendPercentage={20} // number that represent the % of with that legend going to use.
                    legendFont={{
                        family: 'Arial',
                        size: 9,
                        color: 'yellow',
                        weight: 'bold',
                    }}
                    valueFont={{
                        family: 'Arial',
                        size: 9,
                        color: 'black',
                        weight: 'bold',
                    }}
                    labelFont={{
                        family: 'Arial',
                        size: 9,
                        color: 'black',
                        weight: 'bold',
                    }}
                    //Custom bubble/legend click functions such as searching using the label, redirecting to other page
                    bubbleClickFunc={() => {
                        alert('sdlfksdlkflsdkf')
                    }}
                    legendClickFun={this.legendClick.bind(this)}
                    data={[
                        {label: 'app1', value: 1},
                        {label: 'app2', value: 5},
                        {label: 'app3', value: 12},
                        {label: 'app4', value: 3},
                        {label: 'app5', value: 12},
                        {label: 'app6', value: 3},
                        {label: 'app7', value: 12},
                        {label: 'app8', value: 3},
                        {label: 'app9', value: 3},
                        {label: 'app10', value: 3},
                        {label: 'app11', value: 3},


                    ]}
                />
            </div>
        );
    };
};

