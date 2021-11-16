import { ImageList, ImageListItem } from '@material-ui/core'
import React from 'react'
import Map from '../../common/map/Map'
import Module from '../../common/Module'
import Legend from '../../common/legend/Legend'
import DragButton from '../../list/DragButton'
class ClusterMonitoring extends React.Component {
    constructor(props) {
        super()
    }


    render() {
        const { tools, legends, selection, refresh, handleDataStateChange, handleSelectionStateChange } = this.props
        const { moduleId, regions } = tools
        return (
            <React.Fragment>
                <Legend tools={tools} data={legends} handleSelectionStateChange={handleSelectionStateChange} refresh={refresh} />
                <div style={{ position: 'relative', height: 4 }}>
                    <DragButton height={400} />
                </div>
                <div id='resource-block' className="block block-2">
                    <ImageList cols={4} rowHeight={300} >
                        <ImageListItem cols={4}>
                            <Map tools={tools} regions={regions} data={legends} selection={selection} refresh={refresh} />
                        </ImageListItem>
                        {tools.regions.map(region => (
                            <Module key={region} region={region} moduleId={moduleId} tools={tools} selection={selection} handleDataStateChange={handleDataStateChange} />
                        ))}
                    </ImageList>
                </div>
            </React.Fragment>
        )
    }
}
export default ClusterMonitoring