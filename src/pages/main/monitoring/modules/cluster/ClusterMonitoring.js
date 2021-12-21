import { ImageList, ImageListItem } from '@material-ui/core'
import React from 'react'
import Map from '../../common/map/Map'
import Module from '../../common/Module'
import Legend from '../../common/legend/Legend'
import DragButton from '../../list/DragButton'
import { fields } from '../../../../../services/model/format';
class ClusterMonitoring extends React.Component {
    constructor(props) {
        super()
    }


    render() {
        const { tools, legends, selection, refresh, handleDataStateChange, loading, handleSelectionStateChange, metricRequestData } = this.props
        const { moduleId, search, regions, organization, visibility, range } = tools
        return (
            <React.Fragment>
                <Legend tools={tools} data={legends} loading={loading} handleSelectionStateChange={handleSelectionStateChange} refresh={refresh} sortBy={[fields.clusterName]}/>
                <div style={{ position: 'relative', height: 4 }}>
                    <DragButton height={400} />
                </div>
                <div id='resource-block' className="block block-2">
                    <ImageList cols={4} rowHeight={300} >
                        {
                            visibility.includes(fields.map) ? <ImageListItem cols={4}>
                                <Map moduleId={moduleId} search={search} regions={regions} data={legends} selection={selection} zoom={2} />
                            </ImageListItem> : null
                        }
                        {tools.regions.map(region => (
                            legends && legends[region] ? <Module key={region} region={region} legends={legends[region]} metricRequestData={metricRequestData[region]} moduleId={moduleId} visibility={visibility} search={search} range={range} organization={organization} selection={selection} handleDataStateChange={handleDataStateChange} /> : null
                        ))}
                    </ImageList>
                </div>
            </React.Fragment>
        )
    }
}
export default ClusterMonitoring