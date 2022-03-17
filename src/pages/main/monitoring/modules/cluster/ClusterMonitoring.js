import { ImageList, ImageListItem } from '@material-ui/core'
import React from 'react'
import Map from '../../common/map/Map'
import Module from '../../common/Module'
import Legend from '../../common/legend/Legend'
import DragButton from '../../list/DragButton'
import { fields } from '../../../../../services/model/format';
import BulletChart from '../../charts/bullet/BulletChart'
class ClusterMonitoring extends React.Component {
    constructor(props) {
        super()
    }


    renderTootip = () => {
        const { hoverData } = this.state
        if (hoverData) {
            const { type, column, data } = hoverData
            if (type === 'Bullet') {
                const { ranges, markers, measures } = data
                const cloudetAllocation = markers[0]
                const cloudetUsage = measures[1]
                const { unit } = column
                return (
                    <div>
                        <p style={{ display: 'flex', alignItems: 'center', color: '#CECECE', fontWeight: 900 }}><Icon size={10} color={'rgba(67,167,111,.4)'}>circle</Icon>&nbsp;&nbsp;{`Total Available: ${unit ? convertUnit(unit, ranges[0]) : ranges}`}</p>
                        <p style={{ display: 'flex', alignItems: 'center', color: '#CECECE', fontWeight: 900 }}><Icon size={10} color={'rgba(67,167,111,.9)'}>circle</Icon>&nbsp;&nbsp;{`Total Used: ${unit ? convertUnit(unit, measures[0]) : measures[0]}`}</p>
                        <p style={{ display: 'flex', alignItems: 'center', color: '#CECECE', fontWeight: 900 }}><Icon size={10} color={'#1B432C'}>circle</Icon>&nbsp;&nbsp;{`Quota Limit: ${cloudetAllocation > 0 ? unit ? convertUnit(unit, cloudetAllocation) : cloudetAllocation : 'Not Set'}`}</p>
                        <p style={{ display: 'flex', alignItems: 'center', color: '#CECECE', fontWeight: 900 }}><Icon size={10} color={'#FFF'}>circle</Icon>&nbsp;&nbsp;{`Resource Used: ${unit && cloudetUsage > 0 ? convertUnit(unit, cloudetUsage) : cloudetUsage}`}</p>
                    </div>
                )
            }
            else {
                return <p>{data}</p>
            }
        }
        return null
    }

    onHover = (e, hoverData) => {
        this.setState({ anchorEl: e ? e.target : undefined, hoverData })
    }

    dataFormatter = (column, data, tools) => {
        if (column.field === fields.cpu || column.field === fields.disk || column.field === fields.memory) {
            let value = { title: "", subtitle: "", unit: column.unit, ranges: [100], measures: [0, parseInt(data[tools.stats])], markers: [0] }
            return <BulletChart data={[value]} column={column} />
        }
        else
        {
            return data[tools.stats] 
        }
    }

    render() {
        const { tools, legends, selection, refresh, handleDataStateChange, loading, handleSelectionStateChange, metricRequestData } = this.props
        const { moduleId, search, regions, organization, visibility, range } = tools
        return (
            <React.Fragment>
                <Legend id={moduleId} tools={tools} data={legends} loading={loading} handleSelectionStateChange={handleSelectionStateChange} refresh={refresh} sortBy={[fields.clusterName]} groupBy={[fields.cloudletName, fields.operatorName]} formatter={this.dataFormatter}/>
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