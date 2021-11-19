import React from 'react'
import { connect } from 'react-redux'
import { Card, CircularProgress, ImageListItem } from '@material-ui/core'
import LineChart from '../../charts/linechart/MexLineChart'
import { fetchResourceData, fetchFlavorBySelection } from '../../services/service'
import MetricWorker from '../../services/metric.worker.js'
import { equal } from '../../../../../helper/constant/operators'
import { fields } from '../../../../../services/model/format'
import { Skeleton } from '@material-ui/lab'

class ResourceChart extends React.Component {
    constructor(props) {
        super()
        this.state = {
            dataList: undefined
        }
        this.isInit = true
        this.metricWorker = new MetricWorker();
        this.isFlavor = props.resource.field === fields.flavorusage
    }

    metricKeyGenerator = (resourceType) => {
        return `${resourceType.serverField}${resourceType.subId ? `-${resourceType.subId}` : ''}`
    }

    render() {
        const { dataList } = this.state
        const { style, legends, range, search, selection } = this.props
        return (
            <React.Fragment>
                <ImageListItem cols={1} style={style}>
                    <Card style={{ height: 300 }}>
                        {dataList ? dataList.map((data, i) => {
                            let key = this.metricKeyGenerator(data.resourceType)
                            return <LineChart key={key} id={key} data={data} legends={legends} selection={selection} range={range} search={search} disableSelection={this.isFlavor} />
                        }) : this.isInit ? <Skeleton variant='rect' height={300} /> : <div align="right" style={{ display: 'inline-block', float: 'right', marginRight: 10, marginTop:10 }}>
                            <CircularProgress size={20} thickness={3} />
                        </div>
                        }
                    </Card>
                </ImageListItem>
            </React.Fragment>
        )
    }

    fetchResources = async () => {
        const { region, legends, legendList, moduleId, resource, range, selection, handleLegendStateChange } = this.props
        let dataObject = await fetchResourceData(this, moduleId, { region, legends, legendList, resourceKey: resource, range, selection, worker: this.metricWorker })
        if (dataObject) {
            const { resources, data } = dataObject
            this.setState({ dataList: data })
            if (resources) {
                handleLegendStateChange(resources)
            }
        }
        this.isInit = false
    }

    onSelection = async () => {
        const { dataList } = this.state
        const { region, selection } = this.props
        let data = await fetchFlavorBySelection({ worker: this.metricWorker, region, selection, dataList })
        if (data) {
            this.setState({ dataList: [data] })
        }
    }

    componentDidUpdate(preProps, preState) {
        const { range, selection, resource } = this.props
        //fetch data on range change
        if (!equal(range, preProps.range)) {
            this.setState({ dataList: undefined })
            this.fetchResources()
        }
        else if (selection && selection.count !== preProps.selection.count && this.isFlavor) {
            this.onSelection()
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