/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Grid } from '@material-ui/core'
import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Icon } from 'semantic-ui-react'


const optionsGenerator = () => (
    {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        showAllTooltips:true
    }
)

class MexPieChart extends React.Component {

    constructor(props) {
        super(props)
        this.options = optionsGenerator(this.header, this.unit)
        this.data = []
        this.color = []
        this.labels = []
    }

    formatData = (chartData) => {
        if (chartData) {
            this.data = []
            this.color = []
            this.labels = []
            Object.keys(chartData).map(key => {
                if (key !== 'total') {
                    let info = chartData[key]
                    this.labels.push(key)
                    this.color.push(info['color'])
                    this.data.push(info['value'])
                }
            })
            return {
                labels : this.labels,
                datasets: [{
                    backgroundColor: this.color,
                    data: this.data
                }]
            }
        }
    }

    render() {
        const { chartData, header } = this.props
        return (
            <div mex-test="component-pie-chart" style={{ padding: 10, width: '100%' }} >
                <Grid container>
                    <Grid item xs={5}>
                        <div align="left">
                            <h3>{header}</h3>
                        </div>
                        <br/>
                        {this.labels.map((label, i) => {
                            return <div key={label} style={{marginBottom:5, fontSize:11}}><Icon style={{ color: this.color[i] }} name={'circle'} />&nbsp;&nbsp;{label.toUpperCase()}</div>
                        })}
                    </Grid>
                    <Grid item xs={7}>
                        <Pie data={this.formatData(chartData)} options={this.options} height={160} />
                    </Grid>
                </Grid>

            </div>
        )
    }
}

export default MexPieChart