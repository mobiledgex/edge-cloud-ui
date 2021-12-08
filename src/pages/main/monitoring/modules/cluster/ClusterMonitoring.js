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
        const { tools, legends, selection, refresh, handleDataStateChange, handleSelectionStateChange } = this.props
        const { moduleId, search, regions, organization, visibility, range } = tools
        return (
            <React.Fragment>
                <Legend tools={tools} data={legends} handleSelectionStateChange={handleSelectionStateChange} refresh={refresh} sortBy={[fields.clusterName]}/>
                <div style={{ position: 'relative', height: 4 }}>
                    <DragButton height={400} />
                </div>
                <div id='resource-block' className="block block-2">
                    <ImageList cols={4} rowHeight={300} >
                        {
                            visibility.includes(fields.map) ? <ImageListItem cols={4}>
                                <Map moduleId={moduleId} search={search} regions={regions} data={legends} selection={selection} refresh={refresh} />
                            </ImageListItem> : null
                        }
                        {tools.regions.map(region => (
                            <Module key={region} region={region} moduleId={moduleId} search={search} visibility={visibility} range={range} organization={organization} selection={selection} handleDataStateChange={handleDataStateChange} />
                        ))}
                    </ImageList>
                </div>
            </React.Fragment>
        )
    }
}
export default ClusterMonitoring