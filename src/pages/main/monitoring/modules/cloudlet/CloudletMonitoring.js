import React from 'react'
import { Card, ImageList, ImageListItem } from '@material-ui/core'
import Module from '../../common/Module'
import CloudletEvent from './CloudletEvent'
import Map from '../../common/map/Map'
import Legend from '../../common/legend/Legend'
import DragButton from '../../list/DragButton'
import { ACTION_LATENCY_METRICS } from '../../../../../helper/constant/perpetual'
import DMEMetrics from '../../dme/DMEMetrics'

const actionMenu = [
    { id: ACTION_LATENCY_METRICS, label: 'Show Latency Metrics' },
]
class CloudletMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            actionView:undefined
        }
    }

    handleAction = (action, data) => {
        let actionView = { id: action.id, data }
        this.setState({actionView})
    }

    render() {
        const {actionView} = this.state
        const { tools, legends, selection, refresh, handleDataStateChange, handleSelectionStateChange } = this.props
        const { moduleId, regions } = tools
        return (
            <React.Fragment>
                <Legend tools={tools} data={legends} handleAction={this.handleAction} actionMenu={actionMenu} handleSelectionStateChange={handleSelectionStateChange} refresh={refresh} />
                <div style={{ position: 'relative', height: 4 }}>
                    <DragButton height={400} />
                </div>
                <div id='resource-block' className="block block-2">
                    <ImageList cols={4} rowHeight={300} >
                        <ImageListItem cols={3}>
                            <Map tools={tools} regions={regions} data={legends} selection={selection} refresh={refresh} />
                        </ImageListItem>
                        <ImageListItem cols={1}>
                            <Card style={{ height: 300 }}>
                                <CloudletEvent tools={tools} />
                            </Card>
                        </ImageListItem>
                        {/* {regions.map((region, i) => (
                        <CloudletFlavorUsage key={`flavor_${region}_${i}`} range={range} filter={tools} avgData={avgData[region]} rowSelected={rowSelected} region={region} org={selectedOrg} />
                    ))} */}
                        {regions.map(region => (
                            <Module key={region} region={region} moduleId={moduleId} tools={tools} selection={selection} handleDataStateChange={handleDataStateChange} />
                        ))}
                        {actionView && actionView.id === ACTION_LATENCY_METRICS ? <DMEMetrics id={moduleId} onClose={() => { this.setState({ actionView: undefined }) }} data={[actionView.data]} /> : null}
                    </ImageList>
                </div>
            </React.Fragment>
        )
    }

    componentDidMount() {
    }
}
export default CloudletMonitoring