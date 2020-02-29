// @flow
import * as React from 'react';
import {Chart} from "react-google-charts";

type Props = {};
type State = {};

export default class PieChartWrapper extends React.Component<Props, State> {


    render() {

        const chartDataList = [
            [
                "Element",
                "MEM USAGE",
                {
                    "role": "style"
                },
                {
                    "role": "annotation"
                }
            ],
            [
                "autoclusterbicapp\n[hamburg-stage]",
                13.642352680654522,
                "rgb(222,0,0)",
                "13.64 %"
            ],
            [
                "autoclusterbicapp\n[Rah123]",
                9.993702696076491,
                "rgb(255,150,0)",
                "9.99 %"
            ],
            [
                "autoclusterbicapp\n[frankfurt-eu]",
                5.322515112721377,
                "rgb(255,246,0)",
                "5.32 %"
            ],
            [
                "Rah-Clust-8\n[frankfurt-eu]",
                3.3535165807436997,
                "rgb(91,203,0)",
                "3.35 %"
            ]
        ]

        return (
            <div style={{height: 500}}>

                <div style={{height: '100%'}}>
                    <div className='page_monitoring_title_area' style={{display: 'flex', flexDirection: 'row'}}>
                        <div className='page_monitoring_title_select' style={{flex: .7}}>
                            Mem
                        </div>
                    </div>
                    <div className='page_monitoring_container'>
                        <Chart
                            width={'100%'}
                            height={'100%'}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={chartDataList}
                            options={{
                                title: 'My Daily Activities',
                            }}
                            rootProps={{'data-testid': '1'}}
                        />
                    </div>
                </div>

            </div>
        );
    };
};
