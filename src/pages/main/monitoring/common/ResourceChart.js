import React from 'react'
import { connect } from 'react-redux'
import { Card, ImageListItem } from '@material-ui/core'
import LineChart from '../charts/linechart/MexLineChart'
import { fetchResourceData } from '../services/service'
import MetricWorker from '../services/metric.worker.js'

class ResourceChart extends React.Component {
    constructor(props) {
        super()
        this.state = {
            dataList: undefined
        }
        this.metricWorker = new MetricWorker();
    }

    metricKeyGenerator = (resourceType) => {   
        return `${resourceType.serverField}${resourceType.subId ? `-${resourceType.subId}` : ''}`
    }

    render() {
        const { dataList } = this.state
        const { style, legends, tools } = this.props
        const { range } = tools
        return (
            dataList ? dataList.map((data, i) => {
                let key = this.metricKeyGenerator(data.resourceType)
                return (
                    <ImageListItem key={key} cols={1} style={style}>
                        <Card style={{ height: 300 }}>
                            <LineChart id={key} rowSelected={0} data={data} avgData={legends} globalFilter={{search:''}} range={range} />
                        </Card>
                    </ImageListItem>
                )
            }) : null
        )
    }

    fetchResources = async () => {
        const { region, legends, legendList, moduleId, resource, tools, handleLegendStateChange } = this.props
        const { range } = tools
        let dataObject = await fetchResourceData(this, moduleId, { region, legends, legendList, resourceKey: resource, range, worker: this.metricWorker })
        if (dataObject) {
            const { resources, data } = dataObject
            this.setState({ dataList: data })
            handleLegendStateChange(resources)
        }
    }

    componentDidMount() {
        this.fetchResources()
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        privateAccess: state.privateAccess.data,
    }
};

export default connect(mapStateToProps, null)(ResourceChart);