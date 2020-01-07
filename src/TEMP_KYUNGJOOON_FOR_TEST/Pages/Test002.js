import * as React from 'react';
import FlexBox from "flexbox-react";
import {Progress} from "antd";


export default class Test002 extends React.Component {


    render() {
        const options = {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light2", // "light1", "dark1", "dark2"
            title: {
                text: "Bounce Rate by Week of Year"
            },
            axisY: {
                title: "Bounce Rate",
                includeZero: false,
                suffix: "%"
            },
            axisX: {
                title: "Week of Year",
                prefix: "W",
                interval: 2
            },
            data: [{
                type: "line",
                toolTipContent: "Week {x}: {y}%",
                dataPoints: [
                    {x: 1, y: 64},
                    {x: 2, y: 61},
                    {x: 3, y: 64},
                    {x: 4, y: 62},
                    {x: 5, y: 64},
                    {x: 6, y: 60},
                    {x: 7, y: 58},
                    {x: 8, y: 59},
                    {x: 9, y: 53},
                    {x: 10, y: 54},
                    {x: 11, y: 61},
                    {x: 12, y: 60},
                    {x: 13, y: 55},
                    {x: 14, y: 60},
                    {x: 15, y: 56},
                    {x: 16, y: 60},
                    {x: 17, y: 59.5},
                    {x: 18, y: 63},
                    {x: 19, y: 58},
                    {x: 20, y: 54},
                    {x: 21, y: 59},
                    {x: 22, y: 64},
                    {x: 23, y: 59}
                ]
            }]
        }
        return (
            <div style={{width:350}}>
                <Progress
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                    }}
                    percent={99.9}
                />
                <Progress
                    strokeColor={{
                        '0%': 'red',
                        '100%': 'pink',
                    }}
                    percent={99.9}
                    strokeWidth={50}
                    style={{height:80}}
                    width={450}
                    strokeLinecap={'square'}
                    percent={80}
                />
                <Progress
                    strokeColor={{
                        from: '#108ee9',
                        to: '#87d068',
                    }}
                    strokeWidth={50}
                    style={{height:80}}
                    width={450}
                    strokeLinecap={0}
                    percent={80}
                    showInfo={true}
                    format={percent => percent + '%'}
                />
                <Progress
                    strokeColor={{
                        from: 'blue',
                        to: 'black',
                    }}
                    strokeWidth={50}
                    style={{height:80}}
                    width={450}
                    strokeLinecap={0}
                    percent={80}
                    showInfo={true}
                    format={percent => percent + '%'}
                />
                <FlexBox style={{display: 'flex', justifyContent: 'center', marginTop: 50,}}>
                    <FlexBox style={{width: 450, height: 30}}>

                    </FlexBox>


                </FlexBox>
            </div>
        );
    }
}

