import React from 'react'
import MexChart from '../../charts/MexChart'

class ClusterMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
        }
    }

    render() {
        const { chartData, avgData, filter } = this.props
        return (
            filter.parent.id === 'cloudlet' ?
                <div className='grid-charts'>
                    <MexChart chartData={chartData} avgData={avgData} filter={filter}  style={{height:'calc(100vh - 330px)'}}/>
                </div> : null
        )
    }
}
export default ClusterMonitoring