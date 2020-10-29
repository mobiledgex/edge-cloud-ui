import React from 'react'
import MexChart from '../../charts/MexChart'

class ClusterMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
        }
    }

    render() {
        const { chartData, avgData, filter, rowSelected } = this.props
        return (
            filter.parent.id === 'cluster' ?
                <div className='grid-charts'>
                    <MexChart chartData={chartData} avgData={avgData} filter={filter}  rowSelected={rowSelected} style={{height:'calc(100vh - 330px)'}}/>
                </div> : null
        )
    }
}
export default ClusterMonitoring