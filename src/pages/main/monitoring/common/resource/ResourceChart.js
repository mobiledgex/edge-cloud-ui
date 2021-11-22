import React from 'react'
import { connect } from 'react-redux'
import { Card, ImageListItem } from '@material-ui/core'
import LineChart from '../../charts/linechart/MexLineChart'
import { fetchResourceData, fetchFlavorBySelection } from '../../services/service'
import MetricWorker from '../../services/metric.worker.js'
import { equal } from '../../../../../helper/constant/operators'
import { fields } from '../../../../../services/model/format'

class ResourceChart extends React.Component {
    constructor(props) {
        super()
        this.state = {
            dataList: undefined
        }
        this.metricWorker = new MetricWorker();
        this.isFlavor = props.resource.field === fields.flavorusage
    }

    metricKeyGenerator = (resourceType) => {
        return `${resourceType.serverField}${resourceType.subId ? `-${resourceType.subId}` : ''}`
    }

    render() {
        const { dataList } = this.state
        const { style, legends, range, search, selection, visibility } = this.props
        return (
            <React.Fragment>
                {dataList ? dataList.map((data, i) => {
                    let key = this.metricKeyGenerator(data.resourceType)
                    return (
                        visibility.includes(data.resourceType.field) ? <ImageListItem key={key} cols={1} style={style}>
                            <Card style={{ height: 300 }}>
                                <LineChart id={key} data={data} legends={legends} selection={selection} range={range} search={search} disableSelection={this.isFlavor}/>
                            </Card>
                        </ImageListItem> : null
                    )
                }) : null}
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
            this.setState({dataList:undefined })
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